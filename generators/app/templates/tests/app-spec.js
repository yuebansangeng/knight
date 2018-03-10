import React, {Component, PropTypes} from 'react'
import App from '../src/index';
import { shallow, mount, render } from 'enzyme';

describe('App', ()=> {
    it('render correct', () => {
    	const warpper =  render(<App />);
      	expect(warpper.text()).toEqual("hello world");
    })
})