import React from 'react';
import withAuth from '../../../hooks/chechAuthHookHOC';

function ForumThemePage() {
  return <div>ForumThemePage</div>;
}

const ForumThemePageHOC = withAuth(ForumThemePage);

export default ForumThemePageHOC;
