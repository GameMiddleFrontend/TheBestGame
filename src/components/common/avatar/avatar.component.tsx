import React, {ChangeEvent, FC, MouseEvent} from 'react';
import addImage from '@styles/images/add-image.svg';
import '@images/userImg.svg';

import './avatar.scss';

interface IProps {
  imgSrc?: string;
  className?: string;
  isEditMode?: boolean;
}

interface IHandlers {
  onChangeAvatar?(file: File): void;
}

const avatarUrl = `https://ya-praktikum.tech/api/v2/resources`;

const defaultUserSrc = '/images/userImg.svg';

const AvatarComponent: FC<IProps & IHandlers> = (props: IProps & IHandlers) => {
  const imgSrc = props.imgSrc ? avatarUrl.concat(props.imgSrc) : defaultUserSrc;
  const className = `avatar ${props.className ? props.className : ''}${props.isEditMode ? ' avatar-upload' : ''}`;

  const handleClickAvatar = (event: MouseEvent<HTMLElement>) => {
    if (props.isEditMode) {
      const inputElement = event.currentTarget.getElementsByTagName('input').namedItem('avatar-input');
      inputElement && inputElement.click();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.isEditMode) {
      const files = event.target?.files;
      files && files.length > 0 && props.onChangeAvatar && props.onChangeAvatar(files[0]);
    }
  };

  return (
    <div className={className} onClick={handleClickAvatar}>
      <img crossOrigin="use-credentials" className={'avatar-img'} src={imgSrc} alt={'аватар'} />
      {props.isEditMode && (
        <>
          <input name="avatar-input" type="file" accept=".jpg, .jpeg, .png" onChange={handleInputChange} />
          <img src={addImage} className="icon icon-add-image" role="img" />
        </>
      )}
    </div>
  );
};

export default AvatarComponent;
