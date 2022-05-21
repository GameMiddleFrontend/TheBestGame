import React from 'react';
import renderer from 'react-test-renderer';
import Button from './button';
import cancelArrowImg from '@styles/images/cancel-arrow.svg';

describe('Button', () => {
  it('ButtonText Snapshot', () => {
    const tree = renderer.create(<Button className={'button button-text'}>TextButton</Button>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('ButtonIconOnly Snapshot', () => {
    const tree = renderer.create(<Button className={'button button-icon-only'} icon={cancelArrowImg} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
