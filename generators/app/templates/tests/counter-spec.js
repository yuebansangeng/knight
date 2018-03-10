import React, {Component, PropTypes} from 'react'
import { shallow, mount, render } from 'enzyme';


class Counter extends Component {
  handleClick () {
    var click = this.props.clickCount;
    this.props.handleClick({
      type : 'CHANGE_CLICK',
      clickCount : click + 1
    })
    return true;
  }
  render () {
    this.testMethod();
    return (<h2 className="aa" onClick={this.handleClick.bind(this)}>Click me! Number of clicks: {this.props.clickCount}</h2>);
  }

  componentDidMount() {
    console.log('1111')
  }

  testMethod () {
    console.log('testMethod')
  }
}



describe('Counter Test', ()=> {

	// text检查 渲染：render
  it('render correct', () => {
      const warpper =  render(<Counter  clickCount={0}/>);
      expect(warpper.text()).toEqual("Click me! Number of clicks: 0");
  })

  //事件
  it('click execute correct', () => {
    const onButtonClick = jasmine.createSpy('111');
    const wrapper = shallow(<Counter handleClick={onButtonClick} clickCount={0}/>);
    wrapper.simulate('click');
    expect(onButtonClick.calls.count()).toEqual(1);
  })


  //prototype的方法是否执行
  it('prototype function execute correct', () => {
    spyOn(Counter.prototype, "testMethod");
    mount(<Counter  clickCount={0}/>);
    expect(Counter.prototype.testMethod).toHaveBeenCalled();
      
  })

  //生命周期监测，需要用mount
  //生命周期
  it('componentDidMount execute correct', () => {
    spyOn(Counter.prototype, "componentDidMount");
    mount(<Counter  clickCount={0}/>);
    expect(Counter.prototype.componentDidMount).toHaveBeenCalled();
  })

})