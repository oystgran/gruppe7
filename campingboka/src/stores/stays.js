import { defineStore } from "pinia";
import { db } from "@/main";
import { ref, computed } from "vue";
import { keyBy } from "lodash";
import dayjs from "dayjs";
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

    const staySpanningRange = query(
      collection(db, "Overnattinger"),
      where("innsjekk", "<", dayjs(selectedDate.value).endOf("day").toDate()),
      where("utsjekk", ">=", dayjs(selectedDate.value).endOf("day").toDate()),
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

    const guestDataList = [];
    const batchSize = 30;

    for (let i = 0; i < guestIdList.length; i += batchSize) {
      const batch = guestIdList.slice(i, i + batchSize);

      const guestsInRange = query(
        collection(db, "Gjest"),
        where("__name__", "in", batch)
      );
      const snapshot = await getDocs(guestsInRange);
      const guests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      guestDataList.push(...guests);
    }

    bookingsToday.value = keyBy(
      responseSpanning.map((booking) => {
        return {
          ...booking,
          ...guestDataList.find((guest) => guest.id === booking.gjestId),
        };
      }),
      (stay) => stay.plassId[0]
    );

    console.log("bookingstoday: ", bookingsToday.value);
  }
  /* guestIdList.push(responseSpanning.gjestId); */

  /* Object.values(guests.value).forEach((guest) => {
      guestIdList.push(guest.gjestId);
    }); */
  async function addGuest(guestData, overnattingData) {
    const guestRef = await db.collection("Gjest").add(guestData);
    const gjestId = guestRef.id;

    await db.collection("Overnattinger").add({
      ...overnattingData,
      gjestId,
    });
  }
  async function updateGuest(
    gjestId,
    guestData,
    overnattingId,
    overnattingData
  ) {
    await db.collection("Gjest").doc(gjestId).update(guestData);
    await db
      .collection("Overnattinger")
      .doc(overnattingId)
      .update({
        ...overnattingData,
        gjestId,
      });
  }
  async function deleteGuest(gjestId, overnattingId) {
    // Slett overnattingen først
    await db.collection("Overnattinger").doc(overnattingId).delete();

    // Sjekk om det finnes flere overnattinger for denne gjesten
    const q = query(
      collection(db, "Overnattinger"),
      where("gjestId", "==", gjestId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Ingen andre overnattinger => trygt å slette gjesten
      await db.collection("Gjest").doc(gjestId).delete();
      console.log(`Gjest ${gjestId} ble slettet, ingen flere overnattinger.`);
    } else {
      console.log(
        `Gjest ${gjestId} ble IKKE slettet fordi det finnes flere overnattinger.`
      );
    }
  }
  return {
    count,
    doubleCount,
    increment,
    loadGuests,
    addGuest,
    updateGuest,
    deleteGuest,
    bookingsToday,
  };
});
