<template>
    <div class="add-guest-modal">        
      <div v-if="visible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Gjest</h2>
          <el-form 
            :model="guest"
            label-width="90px"
            label-position="left"
            @submit.prevent="addGuest"
          >
            <el-form-item label="Navn">
              <el-input v-model="guest.navn" required clearable />
            </el-form-item>
  
            <el-form-item label="Bilnummer">
              <el-input v-model="guest.bilnummer" required clearable />
            </el-form-item>
  
            <el-form-item label="Nasjonalitet">
              <el-autocomplete
                v-model="guest.nasjonalitet"
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
                    style="width:20px; height:auto; margin-right:8px;"
                  />
                  <span>{{ item.value }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
  
            <el-form-item label="Innsjekk">
              <el-date-picker 
                v-model="guest.innsjekk" 
                type="datetime" 
                placeholder="Velg innsjekksdato" 
                required
              />
            </el-form-item>
  
            <el-form-item label="Utsjekk">
              <el-date-picker
                v-model="guest.utsjekk"
                type="date"
                placeholder="Velg utsjekksdato"
                required
              />
            </el-form-item>
  
            <el-form-item label="Plass">
              <el-input-number v-model="guest.plass" :min="1" :max="42" />
            </el-form-item>
  
            <el-form-item label="Personer">
              <el-input-number v-model="guest.persons" :min="1" :max="99" />
            </el-form-item>
  
            <el-form-item label="Pris">
              <el-input-number v-model="guest.pris" :controls="false" :min="0" />
            </el-form-item>
  
            <el-form-item>
              <el-button type="success" native-type="submit" style="margin-left:20px;">
                Legg til +
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/main.js';
  import { Timestamp } from 'firebase/firestore';
  import { countries } from '@/tools/countries.js';
  
  export default {
    name: 'AddGuestModal',
    props: {
      initialPlass: {
        type: Number,
        default: 1
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      initialPlass(newVal) {
        this.guest.plass = newVal;
      },
      visible(newVal) {
        if (newVal) {
          this.resetGuest();
        }
      }
    },
    data() {
      return {
        guest: {
          navn: '',
          bilnummer: '',
          nasjonalitet: '',
          plass: this.initialPlass,
          persons: 1,
          pris: 0,
          innsjekk: new Date(),
          utsjekk: null,
        }
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
  
      resetGuest() {
        this.guest = {
          navn: '',
          bilnummer: '',
          nasjonalitet: '',
          plass: this.initialPlass,
          persons: 1,
          pris: 0,
          innsjekk: new Date(),
          utsjekk: null,
        };
      },
  
      // Search code + name.
      querySearch(queryString, cb) {
        let results;
        if (!queryString) {
          results = Object.entries(countries);
        } else {
          const lowerQuery = queryString.toLowerCase();
          results = Object.entries(countries).filter(([code, { name }]) =>
            code.toLowerCase().includes(lowerQuery) ||
            name.toLowerCase().includes(lowerQuery)
          );
        }
        const suggestions = results.map(([code, { name, flag }]) => ({
          value: name,
          code,
          flag
        }));
        cb(suggestions);
      },
  
      validateNationality() {
        const validCountries = Object.values(countries).map(country => country.name);
        if (this.guest.nasjonalitet && !validCountries.includes(this.guest.nasjonalitet)) {
          this.guest.nasjonalitet = "";
        }
      },
  
      async addGuest() {
        try {
          const utsjekkDato = new Date(this.guest.utsjekk);
          utsjekkDato.setHours(12, 0, 0, 0);
  
          await db.collection('Camping')
            .doc('Gjester')
            .collection('Gjester')
            .add({
              Navn: this.guest.navn,
              Bilnummer: this.guest.bilnummer,
              Nasjonalitet: this.guest.nasjonalitet,
              Plass: this.guest.plass,
              Pris: this.guest.pris,
              Innsjekk: Timestamp.fromDate(this.guest.innsjekk),
              Utsjekk: Timestamp.fromDate(utsjekkDato)
            });
  
          this.$message.success('Gjest lagt til!');
          this.closeModal();
        } catch (error) {
          console.error('Feil ved lagring:', error);
          this.$message.error('Kunne ikke lagre gjesten.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .add-guest-modal {
    text-align: center;
    margin-top: 50px;
  }
  
  .add-guest-modal h1 {
    font-size: 2.5em;
    color: #4CAF50;
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
    padding: 8px 10px;
    color: black;
  }
  
  .modal-content .el-form .el-input,
  .modal-content .el-form .el-autocomplete,
  .modal-content .el-form .el-date-picker {
    width: 100%;
  }
  
  .modal-content .el-form .el-input-number {
    width: 50%;
    margin-left: 10px;
  }
  
  .close:hover {
    color: red;
  }
  </style>
  