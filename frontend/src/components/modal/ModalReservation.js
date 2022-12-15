import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { user } from '../../store/user';
import { useRecoilValue } from 'recoil';
import { AiOutlineCalendar } from 'react-icons/ai';
import BasicSelect from '../select/BasicSelect';
import BasicToggle from '../toggle/BasicToggle';
import { createReservation } from '../../api/reservation';
import { makeErrorToast, makeSuccesToast } from '../../utils';
import BasicButton from '../button/BasicButton';
import format from 'date-fns/format';
import {
  isDispoSlot,
  makeSlotsChunks,
  getSlotsRightNumber,
} from '../../utils/utilsResa';

export default function ModalReservation({
  onClose,
  instrument,
  noDispo,
  selectedDate,
  timeline,
}) {
  const profile = useRecoilValue(user);
  const indispo = JSON.parse(noDispo);
  const { id, instrumentName, owner_id } = instrument;
  const [slots, setSlots] = useState({});
  const [selectedSlot, setselectedSlot] = useState({});
  const [timeChecker, setTimeChecker] = useState([]);
  const [reservationHours, setReservationHours] = useState({
    start: '',
    end: '',
  });

  const removeFirstHour = getSlotsRightNumber('START');
  const removeLastHour = getSlotsRightNumber('END');

  function timelineReducer(acc, x) {
    acc[timeline[x]]
      ? (acc[timeline[x]] = [
          ...acc[timeline[x]],
          [parseInt(x), parseInt(x) + 1],
        ])
      : (acc[timeline[x]] = [[parseInt(x), parseInt(x) + 1]]);
    return acc;
  }

  function handleSelectSlot(i) {
    setReservationHours({});
    if (!selectedSlot || !selectedSlot[i]) {
      setselectedSlot((prev) => ({ ...prev, [i]: true }));
    }
    if (selectedSlot || selectedSlot[i]) {
      setselectedSlot((prev) => ({ ...prev, [i]: !selectedSlot[i] }));
    }
    if (selectedSlot) {
      Object.keys(selectedSlot).forEach((el) => {
        if (el != i) {
          setselectedSlot((prev) => ({ ...prev, [el]: false }));
        }
      });
    }
  }

  function handleClose() {
    onClose();
    setSlots({});
  }

  function handleConfirmReservation() {
    let slotNum;
    let valid = true;
    const { start, end } = reservationHours;
    const startInt = parseInt(start);
    const endInt = parseInt(end);
    const resaSlots = makeSlotsChunks([startInt, endInt]);
    const errorMsg = 'mauvaises selections des horaires, merci de recommencer';
    const startHour = `${selectedDate} ${start}:00:00`;
    const endHour = `${selectedDate} ${end}:00:00`;

    if (startInt >= endInt || !startInt || !endInt) {
      makeErrorToast({}, errorMsg);
      return;
    }

    timeChecker.forEach((t) => {
      resaSlots.forEach((r) => {
        if (
          JSON.stringify(t.slot[0]) ==
            JSON.stringify(resaSlots.length === 1 ? r[0] : r) &&
          t.check === true
        ) {
          console.log('creneau deja pris');
          makeErrorToast({}, errorMsg);
          return (valid = false);
        }
      });
    });

    Object.keys(slots).forEach((s) => {
      if ([...slots[s]].includes(startInt) && [...slots[s]].includes(endInt))
        slotNum = s;
    });

    const body = {
      slot_num: slotNum,
      owner_id: owner_id,
      user_id: profile?.id,
      instrument_id: id,
      start: startHour,
      end: endHour,
    };
    if (!valid) return;
    createReservation(body)
      .then(() => {
        makeSuccesToast({}, 'Reservation cree avec succes!!');
      })
      .catch(() =>
        makeErrorToast(
          {},
          'Impossible de creer la reservation, merci de reessayer plus tard..'
        )
      );
    handleClose();
  }

  useEffect(() => {
    setTimeChecker([]);
    const timelineCheck = Object.keys(timeline).reduce(timelineReducer, {});
    const { slotsChunk } = indispo;
    Object.keys(timelineCheck).forEach((t) => {
      timelineCheck[t].slice(0, -1).forEach((hour) => {
        setTimeChecker((prev) => [
          ...prev,
          {
            slot: [hour],
            check: isDispoSlot(hour, slotsChunk),
          },
        ]);
      });
    });
    const daySlots = Object.keys(timeline).reduce(timelineReducer, {});
    Object.keys(daySlots).forEach((s) => {
      daySlots[s].pop();
      daySlots[s] = new Set(
        daySlots[s].filter((x) => !isDispoSlot(x, slotsChunk)).flat()
      );
    });
    setSlots(daySlots);
  }, [id]);

  return (
    <Modal
      show={true}
      size="md"
      popup={true}
      onClose={handleClose}
      className="h-[100vh]"
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center flex flex-col">
          <p className="mb-5 font-normal text-xl text-gray-500">
            {format(new Date(selectedDate), 'dd/MM/yyyy')}
          </p>
          <AiOutlineCalendar className="mx-auto mb-4 h-14 w-14 text-main_color" />
          <h3 className="mb-2 font-normal text-xl text-gray-500">
            {instrumentName}
          </h3>
          {indispo?.txt.length ? (
            <div className="flex flex-col text-center text-red-500">
              <p className="text-sm underline mb-1">non disponible:</p>
              <ul className="text-xs mb-3">
                {indispo?.txt.map((x) => (
                  <li key={x}>
                    {x[0]}h - {x[1]}h
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            ''
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              {slots &&
                Object.keys(slots).map((slot, i) => {
                  const arrayFromSet = [...slots[slot]];
                  if (arrayFromSet.length == 0) return;
                  const [lastH] = arrayFromSet.slice(-1);
                  const firstH = arrayFromSet[0];
                  // console.log(slots[slot]);
                  return (
                    <div key={i}>
                      <p className="text center text-sm  text-gray-500">
                        Creneau(x) entre {firstH}h et {lastH}h
                      </p>
                      <div className="w-full flex justify-around py-2 items-center">
                        <BasicSelect
                          disabled={!selectedSlot || !selectedSlot[i]}
                          setValue={setReservationHours}
                          index={'start'}
                          value={reservationHours.start}
                          deflt={' 🕐 '}
                          data={removeFirstHour(arrayFromSet)}
                          label={'heure de debut*'}
                        />
                        <BasicSelect
                          disabled={!selectedSlot || !selectedSlot[i]}
                          setValue={setReservationHours}
                          index={'end'}
                          value={reservationHours.end}
                          deflt={' 🕐 '}
                          data={removeLastHour(arrayFromSet)}
                          label={'heure de fin*'}
                        />
                        <BasicToggle
                          setValue={() => handleSelectSlot(i)}
                          value={selectedSlot && selectedSlot[i]}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <BasicButton className="text-xl" onClick={handleConfirmReservation}>
              <p>JE RESERVE</p>
            </BasicButton>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
