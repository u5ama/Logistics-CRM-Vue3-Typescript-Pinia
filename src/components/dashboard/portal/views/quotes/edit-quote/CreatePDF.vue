<script>
import html2pdf from 'html2pdf.js';
import { defineComponent } from "vue";
import { useQuotesStore } from "@stores/quotes/quotes";

const quoteStore = useQuotesStore();
const { uploadDocumentForSign } = quoteStore;
export default defineComponent({

  props: [
    "starbuckLogoBlack",
    "quoteBanner",
    "QuotePicOne",
    "QuoteSign",
    "quote",
  ],
  data() {
    return {};
  },
  expose: ['downloadPDF', 'sendForSign'],
  methods: {
    dateFormat(date) {
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    },
    downloadPDF() {
      html2pdf(this.$refs.document, {
        margin: 0,
        filename: "quote.pdf",
        pagebreak: {
          before: ".break-before",
          after: [".break-after", "#after2"],
          avoid: "img",
        },
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      });
    },
    async exportToPDF()
    {
      const options = {
        filename: "quote.pdf",
        margin: [10, 0, 15, 0], // Adjust margins as needed
        format: "A4", // Set the page format (e.g., A4, Letter, etc.)
        orientation: "portrait",
      };
      const pdfElement = this.$refs.document; // Assuming `this.$refs.document` references the HTML element containing the content to be converted to PDF
      const pdfBlob = await html2pdf().set(options).from(pdfElement).output("blob");
      const blob = new Blob([pdfBlob], { type: "application/pdf" });

      // Create a FormData object and append the file to it
      const formData = new FormData();
      formData.append('quoteId', this.quote.id);
      formData.append('upload_file', blob, 'quote.pdf');

      await uploadDocumentForSign(formData);
    },

    async sendForSign() {
      await this.exportToPDF();
    },
  },
});
</script>

<template>
  <div>
    <button
      class="p-button p-button-primary mb-5"
      @click="$emit('send', quote.id)"
    >
      Send to Customer
    </button>
    <button class="p-button p-button-primary mb-5 ml-5" @click="downloadPDF">
      Export to PDF
    </button>
    <button class="p-button p-button-primary mb-5 ml-5" @click="sendForSign">
      Send e-sign Document
    </button>
    <div class="wrapper break-after" ref="document" id="pdfDocument">
      <div class="body">
        <div class="banner">
          <img :src="quoteBanner" alt="banner" />
        </div>
        <div class="content">
          <div class="">
            <p class="exp">{{ quote?.client_name?.toUpperCase() }}</p>
          </div>
          <div class="info">
            <p class="addr">{{ quote?.job_title?.toUpperCase() }} / ADDRESS</p>
            <div>
              <p class="details">{{ quote?.location?.toUpperCase() }}</p>
            </div>
          </div>
        </div>
      </div>
      <main>
        <header>
          <div class="top">
            <div class="logo">
              <img
                :src="this.starbuckLogoBlack"
                alt="logo"
                style="width: 25%"
              />
            </div>
          </div>
        </header>
        <div class="content">
          <div class="valid">
            <div>
              <h1>QUOTE</h1>
              <b>{{ quote?.quote_id }}</b> <br />
              <i
                >Valid for 30 days from date listed below: <br />
                {{
                  dateFormat(quote?.created_at ? quote.created_at : new Date())
                }}
              </i>
            </div>
          </div>
          <div>
            <strong>
              {{ quote?.client_name?.toUpperCase() }} <br />
              <br />
              {{ quote?.client_address?.toUpperCase() }}<br />
            </strong>
            <p>Dear {{ quote?.client_name }},</p>
            <strong>Re: {{ quote?.location }}</strong>
            <p>
              The price quoted for the excavation works at the above-mentioned
              address is: ${{ quote?.total_price }} plus GST
            </p>
            <strong>The quoted price includes:</strong>
            <div v-for="(item, index) in quote?.items" :key="index">
              <ul class="list-st">
                <li>
                  <p>
                    <strong>{{ item.title }}</strong
                    ><br />
                    <span v-html="item.description"></span>
                  </p>
                </li>
              </ul>
              <br />
            </div>
          </div>
          <div>
            <p><strong>The above pricing excludes:</strong></p>
            <ul class="list-st">
              <li>
                <strong
                  >Any / all rock extraction, removal, and / or disposal</strong
                >
              </li>
              <li>
                <strong
                  >Any / all contaminated material and / or any material not
                  classified as “clean fill”</strong
                >
              </li>
            </ul>
          </div>
          <div>
            <h5>TERMS & CONDITIONS</h5>
            <p v-html="quote?.terms_conditions"></p>
            <p v-html="quote?.over_rate"></p>
            <p>Kind Regards,</p>
            <img :src="this.QuoteSign" class="sign" alt="" />
            <p>
              <strong>{{ quote?.settings?.op_manager_name }}</strong
              ><br />
              Operations Manager <br />
              <span class="yel">Starbuck Excavation Pty Ltd</span><br />
              <strong>M: {{ quote?.settings?.op_manager_phone }}</strong> <br />
              <strong>E:</strong> {{ quote?.settings?.op_manager_email }}
            </p>
          </div>
          <div class="quote">
            <p v-html="quote?.settings?.quote_note"></p>
          </div>
          <div class="detail">
            <strong
              >I/We wish to proceed with the services outlined in this
              quotation:</strong
            >
            <p>Name: ………………………………………………………………</p>
            <p>Company Name: Bowden Corp</p>
            <p>Purchase Order: ………………………………………………………………</p>
            <p>Date: ………………………………………………………………</p>
          </div>
          <div>
            <strong
              >I also confirm I am duly authorized to act on behalf of Bowden
              Corp
            </strong>
            <p>Signed: ………………………………………………………………</p>
            <p>Name: ………………………………………………………………</p>
            <p>Position: ……………………………………………………………</p>
            <p>Date: ………………………………………………………………</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.body {
  margin: 0 auto;
}
.banner img {
  width: 100%;
  height: 470px;
  object-fit: cover;
}

.exp {
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 300px;
}

.info {
  text-align: right;
  margin-bottom: 60px;
}

.addr {
  font-size: 37px;
  font-weight: bold;
  margin-bottom: 30px;
}

.details {
  font-size: 17px;
}

@media screen and (max-width: 600px) {
  .body {
    width: 100%;
  }

  .info {
    padding: 0 10px;
    margin-bottom: 30px;
  }

  .exp {
    font-size: 30px;
    margin-bottom: 200px;
  }

  .addr {
    font-size: 17px;
  }

  .details {
    font-size: 15px;
  }
}
body {
  width: 60%;
  margin: 0 auto;
  background-color: #f5f2eb;
}
.top {
  width: 95%;
  margin: auto;
  padding: 1%;
  background-color: #a3a3a3;
  color: white;
  font-size: large;
}
.valid {
  margin-top: -45px;
  display: flex;
  justify-content: flex-end;
  text-align: end;
}
.valid h1 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 40px;
  display: block;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-weight: bold;
}
.content {
  background-color: white;
  width: 95%;
  margin: auto;
  padding: 5%;
}
.photo {
  padding: 0 40px;
}
.sign {
  width: 20%;
  margin-left: -40px;
}
.yel {
  color: #f2ca16;
}
.quote {
  padding: 0 2%;
  font-size: 13px;
  color: #a3a3a3;
}
.detail {
  margin: 30px 0;
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
}
.list-st {
  list-style-type: square;
  padding: 0;
  margin: 0;
}
.list-st li {
  padding-left: 16px;
}
h5 {
  display: block;
  font-size: 0.83em;
  margin-block-start: 1.67em;
  margin-block-end: 1.67em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-weight: bold;
}
</style>