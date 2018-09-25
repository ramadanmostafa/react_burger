import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from './../../components/Burger/Burger';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import Spinner from './../../components/UI/Spinner/Spinner'
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler'


const INGREDIENT_PRICES = {
  salad: 0.7,
  bacon: 0.9,
  cheese: 1.1,
  meat: 2
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };
  
  componentDidMount () {
    axios.get('https://react-burger-7e9e5.firebaseio.com/ingredients.json').then(response => {
      this.setState({ingredients: response.data})
    }).catch(error => {
      this.setState({error: true})
    })
  }
  
  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map(igKey => ingredients[igKey]).reduce((sum, el) => sum + el, 0);
    this.setState({purchasable: sum > 0});
  };
  
  addIngredientHandler = (type) => {
    const updatedCount = this.state.ingredients[type] + 1;
    const updatedIngredient = {...this.state.ingredients};
    updatedIngredient[type] = updatedCount;
    const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({ingredients: updatedIngredient, totalPrice: updatedPrice});
    this.updatePurchaseState(updatedIngredient);
  };
  
  removeIngredientHandler = (type) => {
    const updatedCount = this.state.ingredients[type] - 1;
    if (updatedCount < 0) return;
    const updatedIngredient = {...this.state.ingredients};
    updatedIngredient[type] = updatedCount;
    const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    this.setState({ingredients: updatedIngredient, totalPrice: updatedPrice});
    this.updatePurchaseState(updatedIngredient);
  };
  
  purchaseHandler = () => {
    this.setState({purchasing: true})
  };
  
  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  };
  
  purchaseContinueHandler = () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients, price: this.state.totalPrice,
      customer: { name: 'Ramadan', address: { street: 'dsads', zipCode: 12121, country: 'Egypt' }, email: 'ramadan@gmail.com' },
      deliveryMethod: 'FAST'
    };
    axios.post('/orders.json', order).then(response => {
      this.setState({loading: false, purchasing: false});
    }).catch(error => {
      this.setState({loading: false, purchasing: false});
    })
  };
  
  
  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    
    let burger = this.state.error ? "Ingredients can't be loaded" : <Spinner />;
    let orderSummary = null;
    if (this.state.ingredients){
       burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
            <BuildControls
              added={this.addIngredientHandler}
              removed={this.removeIngredientHandler}
              disabled={disabledInfo}
              purchasable={this.state.purchasable}
              price={this.state.totalPrice}
              ordered={this.purchaseHandler}
            />
        </Aux>
      );
       orderSummary = (
          <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} price={this.state.totalPrice}/>
        );
    }
    if (this.state.loading){
      orderSummary = <Spinner />;
    }
    
    return (
      <Aux>
        <Modal modalClosed={this.purchaseCancelHandler} show={this.state.purchasing}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
  
}

export default withErrorHandler(BurgerBuilder, axios);