import { ref, computed, onMounted } from 'vue';
import { getProjectsPage } from '../api/project';
import { ElMessage } from 'element-plus';
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const projects = ref([]);
const loading = ref(false);
const filters = ref({
    user_id: null,
    project_id: null,
    date_range: null
});
// 定义所有列信息
const allColumns = [
    { label: '项目ID', prop: 'project_id', width: 180 },
    { label: '用户ID', prop: 'user_id', width: 220 },
    { label: '标题', prop: 'title', width: 180, tooltip: true },
    { label: '视频URL', prop: 'video_url', width: 220, tooltip: true },
    { label: '核心创意', prop: 'key_concept', width: 250, tooltip: true },
    { label: '海报URL', prop: 'poster_url', width: 220, tooltip: true },
    { label: '分享码', prop: 'share_code', width: 180 },
    { label: '用户输入', prop: 'user_prompt', width: 300, tooltip: true },
    { label: '封面URL', prop: 'cover_url', width: 220, tooltip: true },
    { label: '缩略图URL', prop: 'thumbnail_url', width: 220, tooltip: true },
    { label: 'BannerURL', prop: 'banner_url', width: 220, tooltip: true },
    { label: '分享海报URL', prop: 'share_poster_url', width: 220, tooltip: true },
    { label: '创建时间', prop: 'created_at', width: 180, format: (val) => val ? new Date(val).toLocaleString() : '无' },
    { label: '更新时间', prop: 'updated_at', width: 180, format: (val) => val ? new Date(val).toLocaleString() : '无' }
];
const copyText = async (text) => {
    if (!text) {
        ElMessage.warning('没有可复制的内容');
        return;
    }
    // 优先使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            ElMessage.success('已复制到剪贴板');
            return;
        }
        catch (e) {
            // 继续走 fallback
        }
    }
    // fallback：兼容 http / 内网 / 老浏览器
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        ElMessage.success('已复制到剪贴板');
    }
    catch (e) {
        ElMessage.error('复制失败，请手动复制');
    }
};
// 默认全选
const selectedColumns = ref(allColumns.map(col => col.prop));
// 根据选中列动态显示
const displayedColumns = computed(() => allColumns.filter(col => selectedColumns.value.includes(col.prop)));
// 列选择控制
const selectAllColumns = () => selectedColumns.value = allColumns.map(col => col.prop);
const deselectAllColumns = () => selectedColumns.value = [];
// 分页 & 搜索
const resetFilters = () => {
    filters.value = { user_id: null, project_id: null, date_range: null };
    page.value = 1;
    fetchProjects();
};
const handlePageChange = (newPage) => {
    page.value = newPage;
    fetchProjects();
};
// 处理分页大小变化
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    page.value = 1;
    fetchProjects();
};
const fetchProjects = async () => {
    loading.value = true;
    try {
        const res = await getProjectsPage(page.value, pageSize.value, filters.value);
        projects.value = res.data.items;
        total.value = res.data.total;
    }
    catch (err) {
        console.error('获取项目列表失败', err);
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchProjects();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-table" },
});
/** @type {__VLS_StyleScopedClasses['project-table']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components.elForm | typeof __VLS_components.ElForm} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    inline: (true),
    ...{ class: "search-form" },
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    inline: (true),
    ...{ class: "search-form" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ submit: {} },
    { onSubmit: () => { } });
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    label: "项目ID",
}));
const __VLS_10 = __VLS_9({
    label: "项目ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.filters.project_id),
    placeholder: "请输入项目ID",
    clearable: true,
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.filters.project_id),
    placeholder: "请输入项目ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[filters,];
var __VLS_11;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: "用户ID",
}));
const __VLS_21 = __VLS_20({
    label: "用户ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.filters.user_id),
    placeholder: "请输入用户ID",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.filters.user_id),
    placeholder: "请输入用户ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[filters,];
var __VLS_22;
let __VLS_30;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: "创建时间",
}));
const __VLS_32 = __VLS_31({
    label: "创建时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
let __VLS_36;
/** @ts-ignore @type {typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker} */
elDatePicker;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.filters.date_range),
    type: "datetimerange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DDTHH:mm:ss",
    clearable: true,
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.filters.date_range),
    type: "datetimerange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DDTHH:mm:ss",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
// @ts-ignore
[filters,];
var __VLS_33;
let __VLS_41;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type {typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown} */
elDropdown;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ style: {} },
    hideOnClick: (false),
    trigger: "click",
}));
const __VLS_49 = __VLS_48({
    ...{ style: {} },
    hideOnClick: (false),
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    type: "primary",
}));
const __VLS_55 = __VLS_54({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
let __VLS_59;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ class: "el-icon-search" },
}));
const __VLS_61 = __VLS_60({
    ...{ class: "el-icon-search" },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
/** @type {__VLS_StyleScopedClasses['el-icon-search']} */ ;
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type {typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown} */
arrowDown;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({}));
const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
// @ts-ignore
[];
var __VLS_62;
// @ts-ignore
[];
var __VLS_56;
{
    const { dropdown: __VLS_70 } = __VLS_50.slots;
    let __VLS_71;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ class: "column-dropdown-menu" },
        ...{ style: {} },
    }));
    const __VLS_73 = __VLS_72({
        ...{ class: "column-dropdown-menu" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    /** @type {__VLS_StyleScopedClasses['column-dropdown-menu']} */ ;
    const { default: __VLS_76 } = __VLS_74.slots;
    let __VLS_77;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({}));
    const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const { default: __VLS_82 } = __VLS_80.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_83;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
        type: "text",
        size: "small",
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        type: "text",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = ({ click: {} },
        { onClick: (__VLS_ctx.selectAllColumns) });
    const { default: __VLS_90 } = __VLS_86.slots;
    // @ts-ignore
    [selectAllColumns,];
    var __VLS_86;
    var __VLS_87;
    let __VLS_91;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        type: "text",
        size: "small",
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        type: "text",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_96;
    const __VLS_97 = ({ click: {} },
        { onClick: (__VLS_ctx.deselectAllColumns) });
    const { default: __VLS_98 } = __VLS_94.slots;
    // @ts-ignore
    [deselectAllColumns,];
    var __VLS_94;
    var __VLS_95;
    let __VLS_99;
    /** @ts-ignore @type {typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider} */
    elDivider;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({}));
    const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_104;
    /** @ts-ignore @type {typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup} */
    elCheckboxGroup;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        modelValue: (__VLS_ctx.selectedColumns),
        ...{ style: {} },
    }));
    const __VLS_106 = __VLS_105({
        modelValue: (__VLS_ctx.selectedColumns),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    for (const [col] of __VLS_vFor((__VLS_ctx.allColumns))) {
        let __VLS_110;
        /** @ts-ignore @type {typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox} */
        elCheckbox;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
            key: (col.prop),
            label: (col.prop),
        }));
        const __VLS_112 = __VLS_111({
            key: (col.prop),
            label: (col.prop),
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        const { default: __VLS_115 } = __VLS_113.slots;
        (col.label);
        // @ts-ignore
        [selectedColumns, allColumns,];
        var __VLS_113;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_107;
    // @ts-ignore
    [];
    var __VLS_80;
    // @ts-ignore
    [];
    var __VLS_74;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_50;
// @ts-ignore
[];
var __VLS_44;
let __VLS_116;
/** @ts-ignore @type {typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem} */
elFormItem;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({}));
const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_124 = __VLS_123({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
let __VLS_127;
const __VLS_128 = ({ click: {} },
    { onClick: (__VLS_ctx.fetchProjects) });
const { default: __VLS_129 } = __VLS_125.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "el-icon-search" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['el-icon-search']} */ ;
// @ts-ignore
[fetchProjects,];
var __VLS_125;
var __VLS_126;
let __VLS_130;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    ...{ 'onClick': {} },
}));
const __VLS_132 = __VLS_131({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
let __VLS_135;
const __VLS_136 = ({ click: {} },
    { onClick: (__VLS_ctx.resetFilters) });
const { default: __VLS_137 } = __VLS_133.slots;
// @ts-ignore
[resetFilters,];
var __VLS_133;
var __VLS_134;
// @ts-ignore
[];
var __VLS_119;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_138;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    data: (__VLS_ctx.projects),
    stripe: (true),
    border: true,
    maxHeight: "600",
    showOverflowTooltip: (true),
    ...{ style: {} },
}));
const __VLS_140 = __VLS_139({
    data: (__VLS_ctx.projects),
    stripe: (true),
    border: true,
    maxHeight: "600",
    showOverflowTooltip: (true),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_143 } = __VLS_141.slots;
for (const [col] of __VLS_vFor((__VLS_ctx.displayedColumns))) {
    let __VLS_144;
    /** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
    elTableColumn;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
        key: (col.prop),
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
    }));
    const __VLS_146 = __VLS_145({
        key: (col.prop),
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    const { default: __VLS_149 } = __VLS_147.slots;
    if (col.prop === 'user_prompt') {
        {
            const { default: __VLS_150 } = __VLS_147.slots;
            const [{ row }] = __VLS_vSlot(__VLS_150);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            let __VLS_151;
            /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
            elTooltip;
            // @ts-ignore
            const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
                content: (row.user_prompt || '无'),
                placement: "top",
            }));
            const __VLS_153 = __VLS_152({
                content: (row.user_prompt || '无'),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_152));
            const { default: __VLS_156 } = __VLS_154.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (row.user_prompt || '无');
            // @ts-ignore
            [projects, vLoading, loading, displayedColumns,];
            var __VLS_154;
            let __VLS_157;
            /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
            elButton;
            // @ts-ignore
            const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
                ...{ 'onClick': {} },
                type: "text",
                size: "small",
            }));
            const __VLS_159 = __VLS_158({
                ...{ 'onClick': {} },
                type: "text",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_158));
            let __VLS_162;
            const __VLS_163 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!(col.prop === 'user_prompt'))
                            return;
                        __VLS_ctx.copyText(row.user_prompt);
                        // @ts-ignore
                        [copyText,];
                    } });
            const { default: __VLS_164 } = __VLS_160.slots;
            // @ts-ignore
            [];
            var __VLS_160;
            var __VLS_161;
            // @ts-ignore
            [];
        }
    }
    else if (col.tooltip) {
        {
            const { default: __VLS_165 } = __VLS_147.slots;
            const [{ row }] = __VLS_vSlot(__VLS_165);
            let __VLS_166;
            /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
            elTooltip;
            // @ts-ignore
            const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
                content: (row[col.prop] || '无'),
                placement: "top",
            }));
            const __VLS_168 = __VLS_167({
                content: (row[col.prop] || '无'),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_167));
            const { default: __VLS_171 } = __VLS_169.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis" },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (row[col.prop] || '无');
            // @ts-ignore
            [];
            var __VLS_169;
            // @ts-ignore
            [];
        }
    }
    else if (col.format) {
        {
            const { default: __VLS_172 } = __VLS_147.slots;
            const [{ row }] = __VLS_vSlot(__VLS_172);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (col.format(row[col.prop] ?? ''));
            // @ts-ignore
            [];
        }
    }
    // @ts-ignore
    [];
    var __VLS_147;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_141;
if (__VLS_ctx.total > 0) {
    let __VLS_173;
    /** @ts-ignore @type {typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination} */
    elPagination;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        background: true,
        layout: "prev, pager, next, ->, jumper, ->, sizes, ->, total",
        currentPage: (__VLS_ctx.page),
        pageSizes: ([10, 20, 50, 100]),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        ...{ class: "pagination" },
    }));
    const __VLS_175 = __VLS_174({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        background: true,
        layout: "prev, pager, next, ->, jumper, ->, sizes, ->, total",
        currentPage: (__VLS_ctx.page),
        pageSizes: ([10, 20, 50, 100]),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        ...{ class: "pagination" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    let __VLS_178;
    const __VLS_179 = ({ currentChange: {} },
        { onCurrentChange: (__VLS_ctx.handlePageChange) });
    const __VLS_180 = ({ sizeChange: {} },
        { onSizeChange: (__VLS_ctx.handleSizeChange) });
    /** @type {__VLS_StyleScopedClasses['pagination']} */ ;
    var __VLS_176;
    var __VLS_177;
}
// @ts-ignore
[total, total, page, pageSize, handlePageChange, handleSizeChange,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
