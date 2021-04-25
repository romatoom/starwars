import Vue from 'vue'
import { Menu, MenuItem, Header, Main, Button, Input, Row, Col, Card, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Header)
Vue.use(Main)
Vue.use(Button)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Loading)
