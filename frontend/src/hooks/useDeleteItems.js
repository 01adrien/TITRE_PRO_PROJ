import { useState } from 'react';
import { deleteInstrument } from '../api/instrument';
import { deleteUser } from '../api/user';
import { makeSuccesToast } from '../utils';
import { listToDelete } from '../store/user';
import { useRecoilState } from 'recoil';

export const viewTolabel = {
  ADMIN_USERS: 'utilisateur(s)',
  ADMIN_INSTRUMENTS: 'instrument(s)',
  USER_RESERVATION: 'reservation(s)',
};

const viewToFunction = {
  ADMIN_USERS: deleteUser,
  ADMIN_INSTRUMENTS: deleteInstrument,
  USER_RESERVATION: null,
};

export function useDeleteItems(view, fn1, setItemsNumber) {
  const [itemsToDelete, setItemsToDelete] = useRecoilState(listToDelete);
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);

  const isChecked = (row, view) => {
    if (view === 'ADMIN_USERS' || view === 'ADMIN_INSTRUMENTS') {
      return !!itemsToDelete.filter(
        (item) => item.id === row.id && item.name === row.name
      ).length;
    }
    if (view === 'USER_RESERVATION') {
      return !!itemsToDelete.filter(
        (item) => item.date === row.date && item.horaires === row.horaires
      ).length;
    }
  };

  function handleSelectItem(e, item) {
    e.target.checked
      ? setItemsToDelete((prev) => [...prev, item])
      : setItemsToDelete((prev) => prev.filter((i) => i.id !== item.id));
  }

  function closeModal() {
    setShowModal(false);
    setItemsToDelete([]);
  }

  function handleConfirm() {
    itemsToDelete.forEach((item) => viewToFunction[view](item.id));
    makeSuccesToast({}, 'suppression effectuée!');
    fn1().then(setItemsNumber);
    closeModal();
  }

  return {
    closeModal,
    openModal,
    handleSelectItem,
    showModal,
    handleConfirm,
    isChecked,
  };
}