<script>
import html2pdf from "html2pdf.js";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["starbuckLogoBlack", "invoice"],
  expose: ['exportToPDF'],
  data() {
    return {};
  },
  methods: {
    dateFormat(date) {
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    },
    exportToPDF() {
      html2pdf(this.$refs.document, {
        margin: 1,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      });
    },
  },
});
</script>
<template>
  <div>
    <button
      class="p-button p-button-primary mb-5 ml-5"
      @click="$emit('send', invoice.id)"
    >
      Send to Customer
    </button>
    <button class="p-button p-button-primary mb-5 ml-5" @click="exportToPDF">
      Export to PDF
    </button>
    <div class="wrapper" ref="document">
      <header>
        <div class="logo">
          <img :src="this.starbuckLogoBlack" alt="logo" style="width: 25%" />
        </div>
        <div class="head">
          <div class="left">
            <h1 class="str">Starbuck Excavation Pty Ltd</h1>
            <p>15/882-900 Cooper Street, Somerton VIC 3062</p>
            <strong>www.starbuckexcavations.com.au</strong>
            <p>ABN 51 253 288 279</p>
            <p>ACN 169 208 780</p>
            <div class="leftTab">
              <table style="font-size: 16px">
                <tr>
                  <td class="address"><strong>Bill To:</strong></td>
                  <td>{{ invoice?.client_name }}</td>
                </tr>
                <tr>
                  <td class="address"><strong>Address:</strong></td>
                  <td>{{ invoice?.client_address }}</td>
                </tr>
                <tr>
                  <td class="address-3">
                    <strong>Job Location:</strong>
                  </td>
                  <td>
                    &nbsp;
                    {{ invoice?.job_address }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="right">
            <h1 class="tax">Tax Invoice</h1>
            <div class="rightTab">
              <table style="font-size: 16px">
                <tr>
                  <td class="datee">Invoice No</td>
                  <td class="datee">
                    <strong>{{ invoice?.invoice_id }}</strong>
                  </td>
                </tr>
                <tr>
                  <td class="datee">Invoice Date</td>
                  <td class="datee">
                    <strong v-if="invoice?.created_at">{{
                      dateFormat(invoice?.created_at)
                    }}</strong>
                  </td>
                </tr>
                <tr>
                  <td class="datee">Job No</td>
                  <td class="datee">
                    <strong>{{ invoice?.job_id }}</strong>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </header>
      <main>
        <h4 v-if="invoice?.products.length > 0" class="table-heading">
          Invoice Products
        </h4>
        <table class="tab" v-if="invoice?.products.length > 0">
          <tr>
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>DOCKET #</th>
            <th>EAP DOCKET #</th>
            <th>GST</th>
            <th>QTY</th>
            <th>RATE</th>
            <th>UNIT</th>
            <th class="amount">AMOUNT ($)</th>
          </tr>
          <tbody>
            <tr
              class="row-2"
              v-for="(pro, index) in invoice?.products"
              :key="index"
            >
              <td>{{ dateFormat(pro.created_at) }}</td>
              <td>{{ pro.name + "" + pro.description }}</td>
              <td>{{ pro.docket }}</td>
              <td>{{ pro.epa_number }}</td>
              <td>$ {{ pro.gst }}</td>
              <td>{{ pro.quantity }}</td>
              <td>$ {{ pro.price }}</td>
              <td>{{ pro.uom }}</td>
              <td class="amount">$ {{ pro.price * pro.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <h4 v-if="invoice?.items.length > 0" class="table-heading">
          Invoice Assets
        </h4>
        <table class="tab" v-if="invoice?.items.length > 0">
          <tr>
            <th>DATE</th>
            <th>START TIME</th>
            <th>END TIME</th>
            <th>ASSET NAME</th>
            <th>DIFFERENCE</th>
            <th>RATE</th>
            <th class="amount">AMOUNT ($)</th>
          </tr>
          <tbody>
            <tr
              class="row-2"
              v-for="(item, index) in invoice?.items"
              :key="index"
            >
              <td>{{ dateFormat(item.created_at) }}</td>
              <td>{{ dateFormat(item.start_time) }}</td>
              <td>{{ dateFormat(item.end_time) }}</td>
              <td>{{ item.asset?.name }}</td>
              <td>{{ item.total_time }} hours</td>
              <td>$ {{ item.invoice_price }}</td>
              <td class="amount">
                $ {{ item.invoice_price * item.total_time }}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
      <footer>
        <div class="sub">
          <table>
            <tr>
              <td class="subPrice"><strong>Subtotal</strong></td>
              <td class="subPrice">${{ invoice?.subTotal }}</td>
            </tr>
            <tr>
              <td class="subPrice"><strong>GST</strong></td>
              <td class="subPrice">${{ invoice?.gst }}</td>
            </tr>
            <tr>
              <td class="subPrice"><strong>Balance Due</strong></td>
              <td class="subPrice">${{ invoice?.finalTotal }}</td>
            </tr>
          </table>
        </div>
        <hr class="topHr" />
        <div class="total">
          <table>
            <tr>
              <th class="totalPrice">Invoice Total</th>
              <th class="totalPrice">${{ invoice?.finalTotal }}</th>
            </tr>
          </table>
        </div>
        <hr class="bottomHr" />
        <div class="last">
          <div class="left">
            <p>BANK ACCOUNT DETAILS</p>
            <p>
              Account Name:
              <strong>{{ invoice?.invoice_settings?.account_name }}</strong>
            </p>
            <p>
              BSB: <strong>{{ invoice?.invoice_settings?.account_bsb }}</strong>
            </p>
            <p>
              ACCOUNT:
              <strong>{{ invoice?.invoice_settings?.account_number }}</strong>
            </p>
            <i>Please reference invoice number</i>
          </div>
          <div class="right">
            <p>Terms:</p>
            <p v-html="invoice?.invoice_settings?.terms"></p>
            <p>
              <strong
                >Please forward all enquiries to<br />
                {{ invoice?.invoice_settings?.inquiry_email }}</strong
              >
            </p>
          </div>
        </div>
        <div class="note">
          <p v-html="invoice?.invoice_settings?.note"></p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
body {
  width: 80%;
  margin: auto;
  padding: 5%;
}
.wrapper {
  padding: 20px;
}
.logo {
  margin-bottom: 20px;
}

.head {
  display: flex;
  justify-content: space-between;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tax {
  color: #ffc000;
  font-size: 35px;
  margin-right: 12%;
}

.leftTab {
  margin: 40px 0 10px 0;
}

table {
  font-size: 20px;
}

.address {
  padding: 10px 0;
}

.address-3 {
  padding: 20px 0;
}

.datee {
  padding: 10px 110px;
}

.tab {
  width: 100%;
  overflow-x: auto;
  border-spacing: 3px;
}

.tab th {
  text-align: left;
  padding: 5px;
  background-color: #ffc000;
  color: white;
}

.row-2 td {
  font-size: 16px;
  background-color: #dbdcdb;
  padding: 5px;
}

.row-3 td {
  font-size: 16px;
  background-color: #ededec;
  padding: 5px;
}

.amount {
  text-align-last: end;
  padding-right: 20px !important;
}

.sub {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.subPrice {
  padding: 5px 20px 5px 160px;
  text-align: end;
  font-size: 16px;
}

.topHr {
  border: 2px solid black;
}

.total {
  display: flex;
  justify-content: flex-end;
}

.totalPrice {
  padding: 5px 20px 5px 120px;
  text-align: end;
  font-size: 25px;
}

.bottomHr {
  border: 1px solid black;
}

.last {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
}

.note {
  margin-top: 100px;
  font-size: 18px;
}

.table-heading {
  color: #ffc000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
