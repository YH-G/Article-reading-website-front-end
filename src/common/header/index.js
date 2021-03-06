import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { actionCreators } from './store';
import { actionCreators as loginActionCreators} from '../../pages/login/store';
import { Link } from 'react-router-dom';
import {
    HeaderWrapper, 
    Logo, 
    Nav, 
    NavItem, 
    NavSearch, 
    SearchInfo, 
    SearchInfoTitle, 
    SearchInfoSwitch, 
    SearchInfoItem, 
    SearchInfoList, 
    Addition, 
    Button, 
    SearchWrapper
} from './style'

class Header extends Component {

    getListArea = () => {
        const { focused, list, page, totalPage, mouseIn, handleMouseEnter, handleMouseLeave, handleChangePage } = this.props
        const newList = list.toJS() //将immutable的list转换为普通的list
        const pageList = [];

        if (newList.length) {
            for (let index = (page-1) * 10; index < page * 10; index++) {
                pageList.push(
                    <SearchInfoItem key={newList[index]}>{newList[index]}</SearchInfoItem>
                )           
            }
        }

        if (focused || mouseIn) {
            return(
            <SearchInfo 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave} >
                <SearchInfoTitle>
                    Hot topics
                    <SearchInfoSwitch 
                        onClick={() => handleChangePage(page, totalPage, this.spinIcon)}>
                        <i ref={(icon) => {this.spinIcon = icon }} className="iconfont spin">&#xe851;</i>  
                        Change
                    </SearchInfoSwitch>
                </SearchInfoTitle> 
                <SearchInfoList>
                    {pageList}
                </SearchInfoList>
            </SearchInfo>
            )
        } else {
            return null;
        }
    }

    render() {
        const { focused, handleInputFocus, handleInputBlur, list, login, logout } = this.props
        return (
            <HeaderWrapper>
                <Link to='/'>
                    <Logo />
                </Link>
                <Nav>
                    <NavItem className='left active'>Home</NavItem>
                    <NavItem className='left'>App</NavItem>
                    
                    <SearchWrapper>
                        <CSSTransition
                            in={focused}
                            timeout={200}
                            classNames="slide"
                        >
                            <NavSearch
                                className={focused ? 'focused' : ''}
                                onFocus={() => handleInputFocus(list)}
                                onBlur={handleInputBlur}
                            ></NavSearch>
                        </CSSTransition>
                        <i className={focused ? 'focused iconfont zoom' : 'iconfont zoom'}>
                            &#xe614;
                        </i>
                        {this.getListArea()}
                    </SearchWrapper>
                </Nav>
                <Addition>  
                    
                    <Link to='/write'>                 
                        <Button className='writting'>
                            <i className="iconfont">&#xe615;</i>
                            Writting
                        </Button>
                    </Link>
                    <Button className='reg'>Sign up</Button>
                    {
                        login ? 
                        <NavItem className='right' onClick={logout}>Sign out</NavItem> : 
                        <Link to='/login'><NavItem className='right'>Sign in</NavItem></Link>
                    }
                    <NavItem className='right'>
                        <i className="iconfont">&#xe636;</i>
                    </NavItem>
                </Addition>
            </HeaderWrapper>
        )
    }
    
}

const mapStateToProps = (state) => {
    return {
        focused: state.getIn(['header', 'focused']),
        list: state.getIn(['header', 'list']),
        page: state.getIn(['header', 'page']),
        totalPage: state.getIn(['header', 'totalPage']),
        mouseIn: state.getIn(['header', 'mouseIn']),
        login: state.getIn(['login','login'])
        //state.get('header').get('focused') //由于更改reducer，state结构发生变化，多了一层header
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleInputFocus(list) {
            /*const action = {
                type: 'search_focus'
            };*/
            if (list.size === 0) {
                dispatch(actionCreators.getList());
            }  
            dispatch(actionCreators.serachFocus());
        },
        handleInputBlur() {
            /*const action = {
                type: 'search_blur'
            };*/
            dispatch(actionCreators.serachBlur());
        },
        handleMouseEnter() {
            dispatch(actionCreators.mouseEnter());
        },
        handleMouseLeave() {
            dispatch(actionCreators.mouseLeave());
        },
        handleChangePage(page, totalPage, spin) {
            let originAngle = spin.style.transform.replace(/[^0-9]/ig, '');
            if (originAngle) {
                originAngle = parseInt(originAngle, 10);
            }else {
                originAngle = 0;
            }
            spin.style.transform = 'rotate(' + originAngle + 360 + 'deg)';

            if (page < totalPage) {
                dispatch(actionCreators.changePage(page+1));
            }else {
                dispatch(actionCreators.changePage(1));
            }
        },
        logout() {
            dispatch(loginActionCreators.logout())
        }
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);