window.MENU_DATA = {
  categories: [
    {
      id:"coffee",
      title:"Кофе",
      desc:"Эспрессо, молочные напитки и классика.",
      cover:"https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1400&q=70"
    },
    {
      id:"breakfast",
      title:"Завтраки",
      desc:"Сытно, быстро и приятно начать день.",
      cover:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=70"
    },
    {
      id:"dessert",
      title:"Десерты",
      desc:"Сладкое к чаю и кофе — красиво и вкусно.",
      cover:"https://images.unsplash.com/photo-1505253213348-ce9c9f8b1c46?auto=format&fit=crop&w=1400&q=70"
    },
    {
      id:"cold",
      title:"Холодные напитки",
      desc:"Лимонады, айс-кофе и свежесть.",
      cover:"https://images.unsplash.com/photo-1528826194825-049f03f9d8a9?auto=format&fit=crop&w=1400&q=70"
    },
  ],

  dishesByCategory: {
    coffee: [
      {
        id:"espresso",
        name:"Эспрессо",
        desc:"Крепкий ароматный кофе.",
        ingredients:["молотый кофе","вода"],
        price:150, weight:"50 мл", calories:5,
        image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"cappuccino",
        name:"Капучино",
        desc:"Кофе с нежной молочной пенкой.",
        ingredients:["эспрессо","молоко"],
        price:200, weight:"200 мл", calories:120,
        image:"https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"latte",
        name:"Латте",
        desc:"Мягкий кофе с молоком и пенкой.",
        ingredients:["эспрессо","молоко"],
        price:220, weight:"300 мл", calories:180,
        image:"https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"mocha",
        name:"Мокачино",
        desc:"Кофе с молоком и шоколадом.",
        ingredients:["эспрессо","молоко","шоколад"],
        price:250, weight:"300 мл", calories:240,
        image:"https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=1200&q=70"
      },
    ],

    breakfast: [
      {
        id:"eggs",
        name:"Яичница",
        desc:"Классика на сковороде.",
        ingredients:["яйца","масло","соль"],
        price:180, weight:"200 г", calories:250,
        image:"https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"oatmeal",
        name:"Овсянка",
        desc:"Нежная и тёплая, как дома.",
        ingredients:["овсянка","молоко","мёд"],
        price:160, weight:"250 г", calories:300,
        image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"toast",
        name:"Тост с авокадо",
        desc:"Хрустящий хлеб и кремовая текстура.",
        ingredients:["хлеб","авокадо","лимон","соль"],
        price:290, weight:"220 г", calories:360,
        image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=70"
      },
    ],

    dessert: [
      {
        id:"cheesecake",
        name:"Чизкейк",
        desc:"Классический сливочный.",
        ingredients:["крем-сыр","печенье","сливки"],
        price:260, weight:"150 г", calories:420,
        image:"https://images.unsplash.com/photo-1542826438-6d8f12f47c36?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"brownie",
        name:"Брауни",
        desc:"Шоколадный и насыщенный.",
        ingredients:["шоколад","масло","какао"],
        price:240, weight:"140 г", calories:460,
        image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"croissant",
        name:"Круассан",
        desc:"Слоёный, нежный, свежий.",
        ingredients:["мука","масло","сахар"],
        price:190, weight:"90 г", calories:310,
        image:"https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1200&q=70"
      },
    ],

    cold: [
      {
        id:"lemonade",
        name:"Домашний лимонад",
        desc:"Лимон + мята, освежает.",
        ingredients:["лимон","мята","сироп","газ. вода"],
        price:220, weight:"400 мл", calories:160,
        image:"https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=70"
      },
      {
        id:"ice_latte",
        name:"Айс латте",
        desc:"Лёд, молоко и эспрессо.",
        ingredients:["лёд","эспрессо","молоко"],
        price:260, weight:"400 мл", calories:190,
        image:"https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=1200&q=70"
      },
    ],
  }
};
