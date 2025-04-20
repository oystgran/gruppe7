import { defineStore } from "pinia";
import { db } from "@/main";
import { ref, computed } from "vue";
import { keyBy } from "lodash";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
export const useStaysStore = defineStore("counter", () => {
  const count = ref(0);
  const bookingsToday = ref({});
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  async function loadGuests(selectedDate) {
    let guestIdList = [];
    /* console.log(selectedDate); */
    const staySpanningRange = query(
      collection(db, "Overnattinger"),
      where("innsjekk", "<=", selectedDate.value),
      where("utsjekk", ">=", selectedDate.value),
      orderBy("innsjekk")
    );
    const staySpanningRangeSnapshot = await getDocs(staySpanningRange);
    const responseSpanning = staySpanningRangeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    responseSpanning.forEach((guest) => {
      guestIdList.push(guest.gjestId);
    });

    const guestsInRange = query(
      collection(db, "Gjest"),
      where("__name__", "in", guestIdList)
    );
    console.log("guestidlist: ");
    console.log(guestIdList);
    const guestsInRangeSnapshot = await getDocs(guestsInRange);
    const responseGuestsSpanning = guestsInRangeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("responseGuestsSpanning");
    console.log(responseGuestsSpanning);
    bookingsToday.value = keyBy(
      responseSpanning.map((booking) => {
        return {
          ...booking,
          ...responseGuestsSpanning.find((guest) => {
            return guest.id === booking.gjestId;
          }),
        };
      }),
      (stay) => {
        return stay.plassId[0];
      }
    );
    console.log("bookingstoday: ");
    console.log(bookingsToday.value);
    /* guestIdList.push(responseSpanning.gjestId); */

    /* Object.values(guests.value).forEach((guest) => {
      guestIdList.push(guest.gjestId);
    }); */
  }
  return { count, doubleCount, increment, loadGuests, bookingsToday };
});
