import React, {useCallback, useState} from 'react';
import SettingsUserFormComponent from './settings-forms/settings-user-form.component';
import SettingsPasswordFormComponent from './settings-forms/settings-password-form.component';

import './settings-page.scss';

const SettingsPage = () => {
  const [isEditPasswordMode, setEditPasswordMode] = useState(false);

  const handleClickEditPasswordButton = useCallback(() => {
    setEditPasswordMode(true);
  }, []);

  const handleSavePassword = useCallback(() => {
    setEditPasswordMode(false);
  }, []);

  return (
    <div className={'page'}>
      <div className={'form-container'}>
        {isEditPasswordMode ? (
          <SettingsPasswordFormComponent isEditPasswordMode={isEditPasswordMode} onSavePassword={handleSavePassword} />
        ) : (
          <SettingsUserFormComponent onClickEditPasswordButton={handleClickEditPasswordButton} />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
