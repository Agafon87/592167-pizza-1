import { prepareAdditional, preparePizzaInfo } from "@/common/helpers";
import misc from "@/static/misc.json";
import { MIN_INGREDIENT_COUNT } from "@/constants";

const DICTIONARIES = {
  additional: [],
};

export default {
  namespaced: true,
  state: {
    pizzas: [],
    selectedAdditional: {},
    receivingOrder: "",
    phone: "",
    address: {},
    totalPrice: 0,
  },

  getters: {
    pizzas({ pizzas }) {
      return preparePizzaInfo(pizzas);
    },
    totalPrice({ pizzas, selectedAdditional }) {
      let totalPrice = 0;
      if (pizzas.length > 0) {
        for (const pizza of pizzas) {
          totalPrice += pizza.sum * pizza.count;
        }
      }
      if (Object.keys(selectedAdditional).length > 0) {
        const selectedAdditionalKeys = Object.keys(selectedAdditional);
        for (const it of selectedAdditionalKeys) {
          const additional = DICTIONARIES.additional.find(
            (el) => el.name === it
          );
          totalPrice += additional.price * selectedAdditional[it];
        }
      }
      return totalPrice;
    },
    additional() {
      return prepareAdditional(DICTIONARIES.additional);
    },
    selectedAdditional({ selectedAdditional }) {
      return selectedAdditional;
    },
  },

  actions: {
    initDefaultValue({ commit }) {
      commit("DEFAULT_VALUE");
    },
    addPizza({ commit }, pizza) {
      commit("ADD_PIZZA", pizza);
    },
    changePizzaCount({ commit }, data) {
      commit("CHANGE_PIZZA_COUNT", data);
    },
    changeSelectedAdditional({ commit }, data) {
      commit("CHANGE_SELECTED_ADDITIONAL", data);
    },
  },

  mutations: {
    DEFAULT_VALUE() {
      DICTIONARIES.additional = misc;
    },
    ADD_PIZZA(state, pizza) {
      const pizzaInfo = state.pizzas.find(
        (it) => it.pizzaName === pizza.pizzaName
      );
      if (pizzaInfo) {
        pizzaInfo.dough = pizza.dough;
        pizzaInfo.sauce = pizza.sauce;
        pizzaInfo.pizzaSize = pizza.pizzaSize;
        pizzaInfo.pizzaName = pizza.pizzaName;
        pizzaInfo.sum = pizza.sum;
        pizzaInfo.selectedIngredients = pizza.selectedIngredients;
      } else {
        pizza.count = 1;
        state.pizzas.push(pizza);
      }
    },
    CHANGE_PIZZA_COUNT(state, data) {
      if (data.count === MIN_INGREDIENT_COUNT) {
        state.pizzas =
          state.pizzas.length > 1
            ? state.pizzas.filter((it) => it.pizzaName !== data.name)
            : [];
      } else {
        const pizza = state.pizzas.find((it) => it.pizzaName === data.name);
        pizza.count = data.count;
      }
    },
    CHANGE_SELECTED_ADDITIONAL(state, data) {
      state.selectedAdditional = { ...state.selectedAdditional, ...data };
      if (data[Object.keys(data)[0]] === MIN_INGREDIENT_COUNT) {
        delete state.selectedAdditional[Object.keys(data)[0]];
      }
    },
  },
};
