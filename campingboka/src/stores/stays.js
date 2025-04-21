import { defineStore } from "pinia";
import { db } from "@/main";
import { ref, computed, watch } from "vue";
import { keyBy } from "lodash";
import dayjs from "dayjs";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
export const useStaysStore = defineStore("counter", () => {
  const count = ref(0);
  const bookingsToday = ref({});
  const doubleCount = computed(() => count.value * 2);
  const selectedDate = ref(new Date());
  function increment() {
    count.value++;
  }

  watch(selectedDate, async () => {
    await loadGuests(selectedDate);
  });

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

    responseSpanning.forEach((booking) => {
      guestIdList.push(booking.gjestId);
    });

    const chunkSize = 30;
    const guestChunks = [];
    for (let i = 0; i < guestIdList.length; i += chunkSize) {
      guestChunks.push(guestIdList.slice(i, i + chunkSize));
    }

    const responseGuestsSpanning = [];
    for (const chunk of guestChunks) {
      const guestsInRange = query(
        collection(db, "Gjest"),
        where("__name__", "in", chunk)
      );
      const snapshot = await getDocs(guestsInRange);
      snapshot.forEach((doc) => {
        responseGuestsSpanning.push({ id: doc.id, ...doc.data() });
      });
    }

    bookingsToday.value = keyBy(
      responseSpanning.map((booking) => {
        return {
          ...booking,
          ...responseGuestsSpanning.find(
            (guest) => guest.id === booking.gjestId
          ),
        };
      }),
      (stay) => stay.plassId[0]
    );

    console.log("bookingstoday: ");
    console.log(bookingsToday.value);
  }
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
    selectedDate,
  };
});
