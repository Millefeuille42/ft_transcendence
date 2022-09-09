import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
// @ts-ignore
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: colors.green.base,
                secondary: colors.green.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                warning: colors.yellow.accent2,
                info: colors.teal.base,
                success: colors.blue.accent3
            }
        }
    }
});
