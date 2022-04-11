interface IPopupProps {
  message: string;
}

interface IEvents {
  onClose: () => void;
}

type PopupProps = IPopupProps & IEvents;

export {IPopupProps, PopupProps};
