<template>
  <div class="update-guest-modal">
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <!-- <h2>Edit Guest</h2> -->
        <h2 v-if="form.plass" style="margin-bottom: 20px">
          Plass nr. {{ form.plass }}
        </h2>
        <el-form
          :model="form"
          label-width="90px"
          label-position="left"
          @submit.prevent="addGuest"
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
            >
              <template v-slot="{ item }">
                <img
                  :src="item.flag"
                  alt="flag"
                  style="width: 20px; height: auto; margin-right: 8px"
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
            <el-input-number
              v-model="form.plass"
              :min="1"
              :max="42"
              class="plassfelt"
            />
          </el-form-item>

          <el-form-item label="Voksne">
            <el-input-number
              v-model="form.voksne"
              :min="0"
              :max="10"
              class="personerfelt"
            />
          </el-form-item>

          <el-form-item label="Barn">
            <el-input-number
              v-model="form.barn"
              :min="0"
              :max="10"
              class="personerfelt"
            />
          </el-form-item>

          <el-form-item label="Strøm">
            <el-switch
              v-model="form.elektrisitet"
              active-text="Ja"
              inactive-text="Nei"
            />
          </el-form-item>

          <el-form-item label="Pris">
            <el-input-number
              v-model="form.pris"
              :controls="false"
              :min="0"
              :disabled="true"
              class="prisfelt"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateGuest">Oppdater</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/main.js";
import { Timestamp } from "firebase/firestore";
import { countries } from "@/tools/countries.js";

const GRUNNPRIS = 340;
const FJORDTILLEGG = 120;
const PRIS_VOKSEN = 40;
const PRIS_BARN = 20;
const PRIS_EL = 50;

const FJORDPLASS_NUMMER = new Set([
  ...Array.from({ length: 19 }, (_, i) => i + 1), // 1–19
  38,
  39,
  40,
  41,
  42,
]);

export default {
  name: "UpdateGuestModal",
  props: {
    visible: Boolean,
    initialPlass: Number,
    guest: Object,
  },
  watch: {
    guest: {
      immediate: true,
      handler(newGuest) {
        if (newGuest) {
          this.form = {
            navn: newGuest.Navn,
            bilnummer: newGuest.Bilnummer,
            nasjonalitet: newGuest.Nasjonalitet,
            pris: newGuest.Pris,
            plass: newGuest.Plass,
            innsjekk: newGuest.Innsjekk?.toDate?.() || null,
            utsjekk: newGuest.Utsjekk?.toDate?.() || null,
            voksne: newGuest.Voksne || 1,
            barn: newGuest.Barn || 0,
            elektrisitet: newGuest.Elektrisitet ?? false,
          };
          this.beregnPris();
        }
      },
    },

    // 👇🏽 Denne må ligge HER inne i watch!
    form: {
      handler() {
        this.beregnPris();
      },
      deep: true,
    },
  },
  data() {
    return {
      form: {
        navn: "",
        bilnummer: "",
        nasjonalitet: "",
        pris: 0,
        plass: null,
        voksne: 1,
        barn: 0,
        elektrisitet: false, // nytt felt
        innsjekk: null,
        utsjekk: null,
      },
    };
  },
  methods: {
    beregnPris() {
      const plass = this.form.plass;
      const voksne = this.form.voksne || 0;
      const barn = this.form.barn || 0;
      const el = this.form.elektrisitet ? PRIS_EL : 0;

      // Sjekk om vi har gyldige datoer
      if (!this.form.innsjekk || !this.form.utsjekk) {
        this.form.pris = 0;
        return;
      }

      // Regn ut antall netter
      const innsjekk = new Date(this.form.innsjekk);
      const utsjekk = new Date(this.form.utsjekk);
      innsjekk.setHours(0, 0, 0, 0);
      utsjekk.setHours(0, 0, 0, 0);

      const tid = utsjekk.getTime() - innsjekk.getTime();
      const netter = tid / (1000 * 60 * 60 * 24);

      if (netter <= 0) {
        this.form.pris = 0;
        return;
      }

      const fjordTillegg = FJORDPLASS_NUMMER.has(plass) ? FJORDTILLEGG : 0;

      const totalPris =
        netter *
        (GRUNNPRIS +
          fjordTillegg +
          voksne * PRIS_VOKSEN +
          barn * PRIS_BARN +
          el);

      this.form.pris = totalPris;
    },
    closeModal() {
      this.$emit("close");
    },

    resetGuest() {
      this.form = {
        navn: "",
        bilnummer: "",
        nasjonalitet: "",
        plass: this.initialPlass,
        persons: 1,
        pris: 0,
        innsjekk: new Date(),
        utsjekk: null,
      };
    },

    async updateGuest() {
      try {
        const utsjekkDato = new Date(this.form.utsjekk);
        utsjekkDato.setHours(12, 0, 0, 0);

        const collectionRef = db
          .collection("Camping")
          .doc("Gjester")
          .collection("Gjester");

        const snapshot = await collectionRef
          .where("Plass", "==", this.form.plass)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          await docRef.update({
            Navn: this.form.navn,
            Bilnummer: this.form.bilnummer,
            Nasjonalitet: this.form.nasjonalitet,
            Pris: this.form.pris,
            Voksne: this.form.voksne,
            Barn: this.form.barn,
            Elektrisitet: this.form.elektrisitet,
            Innsjekk: Timestamp.fromDate(this.form.innsjekk),
            Utsjekk: Timestamp.fromDate(utsjekkDato),
          });

          this.$message.success("Gjest oppdatert!");
          this.$emit("guestUpdated");
          this.$emit("close");
        } else {
          this.$message.error("Fant ikke gjesten i databasen.");
        }
      } catch (err) {
        console.error(err);
        this.$message.error("Noe gikk galt under oppdatering.");
      }
    },

    // Search code + name.
    querySearch(queryString, cb) {
      let results;
      if (!queryString) {
        results = Object.entries(countries);
      } else {
        const lowerQuery = queryString.toLowerCase();
        results = Object.entries(countries).filter(
          ([code, { name }]) =>
            code.toLowerCase().includes(lowerQuery) ||
            name.toLowerCase().includes(lowerQuery)
        );
      }
      const suggestions = results.map(([code, { name, flag }]) => ({
        value: name,
        code,
        flag,
      }));
      cb(suggestions);
    },
    validateNationality() {
      const validCountries = Object.values(countries).map(
        (country) => country.name
      );
      if (
        this.form.nasjonalitet &&
        !validCountries.includes(this.form.nasjonalitet)
      ) {
        this.form.nasjonalitet = "";
      }
    },
    async addGuest() {
      try {
        const utsjekkDato = new Date(this.guest.utsjekk);
        utsjekkDato.setHours(12, 0, 0, 0);

        await db
          .collection("Camping")
          .doc("Gjester")
          .collection("Gjester")
          .add({
            Navn: this.guest.navn,
            Bilnummer: this.guest.bilnummer,
            Nasjonalitet: this.guest.nasjonalitet,
            Plass: this.guest.plass,
            Pris: this.guest.pris,
            Innsjekk: Timestamp.fromDate(this.guest.innsjekk),
            Utsjekk: Timestamp.fromDate(utsjekkDato),
          });

        this.$message.success("Gjest lagt til!");

        this.closeModal();
      } catch (error) {
        console.error("Feil ved lagring:", error);
        this.$message.error("Kunne ikke lagre gjesten.");
      }
    },
  },
};
</script>

<style scoped>
.add-guest-modal {
  text-align: center;
  margin-top: 50px;
}

.add-guest-modal h1 {
  font-size: 2.5em;
  color: #4caf50;
}

.add-guest-modal p {
  font-size: 1.2em;
  color: #555;
}

button {
  font-size: 15px;
  cursor: pointer;
}

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
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 10px;
  padding-right: 10px;
  color: black;
}

.modal-content .el-form .el-input,
.modal-content .el-form .el-autocomplete,
.modal-content .el-form .el-date-picker {
  width: 100%;
}

.modal-content .el-form .el-input-number {
  width: 50%;
  margin-left: 14px;
}

.close:hover {
  color: red;
}
.plassfelt {
}
.personerfelt {
}
.prisfelt {
}
.el-form-item__content {
}
</style>
