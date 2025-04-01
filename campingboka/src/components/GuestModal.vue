<template>
  <div class="guest-modal">
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 style="margin-bottom: 20px">
          {{ mode === "add" ? "Legg til gjest" : "Oppdater gjest" }} (Plass nr.
          {{ form.plass }})
        </h2>

        <el-form
          :model="form"
          label-width="90px"
          label-position="left"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="Navn">
            <el-input v-model="form.navn" required clearable />
          </el-form-item>

          <el-form-item label="Bilnummer">
            <el-input v-model="form.bilnummer" required clearable />
          </el-form-item>

          <el-form-item label="Nasjonalitet">
            <el-autocomplete
              v-model="form.nasjonalitet"
              :fetch-suggestions="querySearch"
              placeholder="Velg nasjonalitet"
              required
              clearable
              @blur="validateNationality"
            >
              <template v-slot="{ item }">
                <img
                  :src="item.flag"
                  alt="flag"
                  style="width: 20px; margin-right: 8px"
                />
                <span>{{ item.value }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="Innsjekk">
            <el-date-picker
              v-model="form.innsjekk"
              type="datetime"
              placeholder="Velg innsjekksdato"
              required
            />
          </el-form-item>

          <el-form-item label="Utsjekk">
            <el-date-picker
              v-model="form.utsjekk"
              type="date"
              placeholder="Velg utsjekksdato"
              required
            />
          </el-form-item>

          <el-form-item label="Plass">
            <div style="display: flex; align-items: center">
              <el-input
                :value="form.plass"
                disabled
                style="width: 100px; margin-left: 25px"
                input-style="text-align: center"
              />
              <span style="opacity: 0.6; font-size: 12px; margin-left: 30px">
                {{ isFjordplass ? "Fjordplass" : "Standardplass" }}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="Voksne">
            <div style="display: flex; align-items: center">
              <el-input-number
                v-model="form.voksne"
                :min="0"
                :max="10"
                style="min-width: 100px"
              />
              <span style="opacity: 0.6; font-size: 12px; margin-left: 12px"
                >+40 kr</span
              >
            </div>
          </el-form-item>

          <el-form-item label="Barn">
            <div style="display: flex; align-items: center">
              <el-input-number
                v-model="form.barn"
                :min="0"
                :max="10"
                style="min-width: 100px"
              />
              <span style="opacity: 0.6; font-size: 12px; margin-left: 12px"
                >+20 kr</span
              >
            </div>
          </el-form-item>

          <el-form-item label="Strøm">
            <div style="display: flex; align-items: center; margin-left: 25px">
              <el-switch
                v-model="form.elektrisitet"
                active-text="Ja"
                inactive-text="Nei"
              />
              <span style="opacity: 0.6; font-size: 12px; margin-left: 40px"
                >+50 kr</span
              >
            </div>
          </el-form-item>

          <el-form-item label="Pris">
            <div style="display: flex; align-items: center">
              <el-input-number
                v-model="form.pris"
                :controls="false"
                :min="0"
                :disabled="true"
                class="prisfelt"
              />

              <el-popover
                v-if="prisDifferanse && prisDifferanse.tillegg !== 0"
                placement="right"
                width="220"
                trigger="hover"
              >
                <template #reference>
                  <el-icon style="margin-left: 8px; cursor: pointer">
                    <info-filled />
                  </el-icon>
                </template>

                <div style="font-size: 13px">
                  <div style="opacity: 0.6">
                    Tidligere pris: {{ prisDifferanse.original }} kr
                  </div>
                  <div style="opacity: 0.6">
                    Ny pris: {{ prisDifferanse.ny }} kr
                  </div>
                  <div
                    v-if="prisDifferanse.tillegg > 0"
                    style="font-weight: bold; color: #d32f2f"
                  >
                    Tillegg å betale: {{ prisDifferanse.tillegg }} kr
                  </div>
                  <div v-else style="font-weight: bold; color: #388e3c">
                    Refunderes: {{ -prisDifferanse.tillegg }} kr
                  </div>
                </div>
              </el-popover>
            </div>

            <div
              v-if="prisOppsummering"
              style="
                text-align: right;
                font-size: 13px;
                opacity: 0.7;
                margin-top: 6px;
              "
            >
              {{ prisOppsummering }}
            </div>
          </el-form-item>
        </el-form>
        <el-form-item v-if="mode === 'edit'">
          <div style="display: flex; margin-left: 30px; gap: 20px">
            <el-button type="success" @click="confirmUpdate">
              <el-icon style="margin-right: 6px"><check /></el-icon>
            </el-button>
            <el-button type="danger" @click="confirmDelete">
              <el-icon style=""><delete /></el-icon>
            </el-button>
          </div>
        </el-form-item>

        <el-form-item v-else>
          <el-button
            type="primary"
            @click="handleSubmit"
            style="margin-left: 30px"
          >
            Legg til
          </el-button>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import { Timestamp } from "firebase/firestore";
import { countries } from "@/tools/countries";
import { InfoFilled, Delete, Check } from "@element-plus/icons-vue";

const GRUNNPRIS = 340;
const FJORDTILLEGG = 120;
const PRIS_VOKSEN = 40;
const PRIS_BARN = 20;
const PRIS_EL = 50;
const FJORDPLASS_NUMMER = new Set([
  ...Array.from({ length: 19 }, (_, i) => i + 1),
  38,
  39,
  40,
  41,
  42,
]);

export default {
  name: "GuestModal",
  components: {
    InfoFilled,
    delete: Delete,
    Check,
  },
  props: {
    visible: Boolean,
    initialPlass: Number,
    guest: Object,
    mode: String, // 'add' eller 'edit'
  },
  data() {
    return {
      form: {
        navn: "",
        bilnummer: "",
        nasjonalitet: "",
        pris: 0,
        plass: this.initialPlass,
        voksne: 1,
        barn: 0,
        elektrisitet: false,
        innsjekk: new Date(),
        utsjekk: null,
      },
      originalPris: 0,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.mode === "add") {
        this.resetForm();
      }
    },
    guest: {
      immediate: true,
      handler(newGuest) {
        if (this.mode === "edit" && newGuest) {
          this.form = {
            navn: newGuest.Navn,
            bilnummer: newGuest.Bilnummer,
            nasjonalitet: newGuest.Nasjonalitet,
            pris: newGuest.Pris,
            plass: newGuest.Plass,
            innsjekk: newGuest.Innsjekk?.toDate?.() || new Date(),
            utsjekk: newGuest.Utsjekk?.toDate?.() || null,
            voksne: newGuest.Voksne || 1,
            barn: newGuest.Barn || 0,
            elektrisitet: newGuest.Elektrisitet ?? false,
          };
          this.originalPris = newGuest.Pris || 0;
        }
      },
    },
    form: {
      handler() {
        this.beregnPris();
      },
      deep: true,
    },
  },
  computed: {
    isFjordplass() {
      return FJORDPLASS_NUMMER.has(this.form.plass);
    },
    prisOppsummering() {
      if (!this.form.innsjekk || !this.form.utsjekk) return "";

      const innsjekk = new Date(this.form.innsjekk);
      const utsjekk = new Date(this.form.utsjekk);
      innsjekk.setHours(0, 0, 0, 0);
      utsjekk.setHours(0, 0, 0, 0);

      const netter = Math.ceil((utsjekk - innsjekk) / (1000 * 60 * 60 * 24));
      if (netter <= 0) return "";

      const voksne = this.form.voksne || 0;
      const barn = this.form.barn || 0;
      const el = this.form.elektrisitet ? PRIS_EL : 0;
      const fjordTillegg = FJORDPLASS_NUMMER.has(this.form.plass)
        ? FJORDTILLEGG
        : 0;

      const prisPerNatt =
        GRUNNPRIS + fjordTillegg + voksne * PRIS_VOKSEN + barn * PRIS_BARN + el;
      const totalPris = netter * prisPerNatt;

      return `${prisPerNatt} kr × ${netter} netter = ${totalPris} kr`;
    },
    prisDifferanse() {
      if (this.mode !== "edit") return null;
      const diff = this.form.pris - this.originalPris;
      return {
        original: this.originalPris,
        ny: this.form.pris,
        tillegg: diff,
      };
    },
  },
  methods: {
    async confirmUpdate() {
      try {
        await this.$confirm(
          `Oppdatere gjesten på plass nr ${this.form.plass}?`,
          "Bekreft forandringer",
          {
            confirmButtonText: "Ja, oppdater",
            cancelButtonText: "Avbryt",
            type: "warning",
          }
        );
        await this.handleSubmit(); // Fortsett hvis bruker bekrefter
      } catch {
        // Bruker avbrøt
      }
    },
    async confirmDelete() {
      try {
        const navn = this.form.navn || "gjest";
        const plass = this.form.plass;
        await this.$confirm(
          `Slett ${navn} fra Plass nr ${plass}?`,
          "Bekreft Sletting",
          {
            confirmButtonText: "Ja, slett",
            cancelButtonText: "Avbryt",
            type: "warning",
          }
        );

        await this.handleDelete(); // Hvis bruker bekrefter
      } catch {
        // Avbrutt
      }
    },
    resetForm() {
      this.form = {
        navn: "",
        bilnummer: "",
        nasjonalitet: "",
        pris: 0,
        plass: this.initialPlass,
        voksne: 1,
        barn: 0,
        elektrisitet: false,
        innsjekk: new Date(),
        utsjekk: null,
      };
      this.originalPris = 0;
    },
    querySearch(queryString, cb) {
      const results = Object.entries(countries).filter(([code, { name }]) => {
        const lower = queryString.toLowerCase();
        return (
          code.toLowerCase().includes(lower) ||
          name.toLowerCase().includes(lower)
        );
      });
      cb(
        results.map(([code, { name, flag }]) => ({ value: name, code, flag }))
      );
    },
    validateNationality() {
      const valid = Object.values(countries).map((c) => c.name);
      if (!valid.includes(this.form.nasjonalitet)) this.form.nasjonalitet = "";
    },
    beregnPris() {
      const { innsjekk, utsjekk, voksne, barn, elektrisitet, plass } =
        this.form;
      if (!innsjekk || !utsjekk) return (this.form.pris = 0);
      const i = new Date(innsjekk),
        u = new Date(utsjekk);
      i.setHours(0, 0, 0, 0);
      u.setHours(0, 0, 0, 0);
      const netter = Math.ceil((u - i) / (1000 * 60 * 60 * 24));
      if (netter <= 0) return (this.form.pris = 0);
      const fjord = FJORDPLASS_NUMMER.has(plass) ? FJORDTILLEGG : 0;
      const pris =
        netter *
        (GRUNNPRIS +
          fjord +
          voksne * PRIS_VOKSEN +
          barn * PRIS_BARN +
          (elektrisitet ? PRIS_EL : 0));
      this.form.pris = pris;
    },
    closeModal() {
      this.$emit("close");
    },
    async handleSubmit() {
      const collectionRef = db
        .collection("Camping")
        .doc("Gjester")
        .collection("Gjester");
      const utsjekkDato = new Date(this.form.utsjekk);
      utsjekkDato.setHours(12, 0, 0, 0);

      const payload = {
        Navn: this.form.navn,
        Bilnummer: this.form.bilnummer,
        Nasjonalitet: this.form.nasjonalitet,
        Plass: this.form.plass,
        Pris: this.form.pris,
        Voksne: this.form.voksne,
        Barn: this.form.barn,
        Elektrisitet: this.form.elektrisitet,
        Innsjekk: Timestamp.fromDate(this.form.innsjekk),
        Utsjekk: Timestamp.fromDate(utsjekkDato),
      };

      try {
        if (this.mode === "add") {
          await collectionRef.add(payload);
          this.$message.success("Gjest lagt til!");
        } else {
          const snapshot = await collectionRef
            .where("Plass", "==", this.form.plass)
            .limit(1)
            .get();
          if (!snapshot.empty) {
            await snapshot.docs[0].ref.update(payload);
            this.$message.success("Gjest oppdatert!");
          } else {
            this.$message.error("Fant ikke gjesten i databasen.");
            return;
          }
        }
        this.$emit("guestSaved");
        this.closeModal();
      } catch (err) {
        console.error(err);
        this.$message.error("Noe gikk galt ved lagring.");
      }
    },
    async handleDelete() {
      try {
        const collectionRef = db
          .collection("Camping")
          .doc("Gjester")
          .collection("Gjester");

        const snapshot = await collectionRef
          .where("Plass", "==", this.form.plass)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.delete();
          this.$message.success("Gjest slettet!");
          this.$emit("guestSaved"); // Oppdater listen
          this.closeModal();
        } else {
          this.$message.error("Fant ikke gjesten i databasen.");
        }
      } catch (err) {
        console.error(err);
        this.$message.error("Noe gikk galt ved sletting.");
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.modal-content {
  position: relative;
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  width: 500px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-content .el-form {
  width: 300px;
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 34px;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 10px;
  color: black;
}
.close:hover {
  color: red;
}
</style>
