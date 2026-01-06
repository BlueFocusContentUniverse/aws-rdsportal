import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { setToken } from '../utils/auth';
import { login } from '../api/auth';
const router = useRouter();
const route = useRoute();
const formRef = ref();
const loading = ref(false);
const form = reactive({
    username: '',
    password: '',
});
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const handleLogin = async () => {
    await formRef.value.validate();
    loading.value = true;
    try {
        const res = await login(form.username, form.password);
        setToken(res.data.access_token);
        ElMessage.success('登录成功');
        // 登录成功跳转
        // 登录后跳转之前访问的页面，默认跳 /projects
        const redirect = route.query.redirect || '/projects';
        await router.push(redirect);
    }
    catch (err) {
        ElMessage.error(err?.response?.data?.message || '登录失败');
    }
    finally {
        loading.value = false;
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-container" },
});
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components.elCard | typeof __VLS_components.ElCard} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "login-card" },
    shadow: "hover",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "login-card" },
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onKeyup': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_8 = __VLS_7({
    ...{ 'onKeyup': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.handleLogin) });
var __VLS_13 = {};
const { default: __VLS_15 } = __VLS_9.slots;
let __VLS_16;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: "用户名",
    prop: "username",
}));
const __VLS_18 = __VLS_17({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "请输入用户名",
    clearable: true,
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "请输入用户名",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
// @ts-ignore
[form, form, rules, handleLogin,];
var __VLS_19;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    label: "密码",
    prop: "password",
}));
const __VLS_29 = __VLS_28({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[form,];
var __VLS_30;
let __VLS_38;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "login-button" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogin) });
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
const { default: __VLS_51 } = __VLS_47.slots;
// @ts-ignore
[handleLogin, loading,];
var __VLS_47;
var __VLS_48;
// @ts-ignore
[];
var __VLS_41;
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
