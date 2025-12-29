import { ref, onMounted } from 'vue';
import { getProjectsPage } from '../api/project';
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
const resetFilters = () => {
    filters.value = { user_id: null, project_id: null, date_range: null };
    page.value = 1;
    fetchProjects();
};
const handlePageChange = (newPage) => {
    page.value = newPage;
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
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    inline: (true),
    ...{ class: "search-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ submit: {} },
    { onSubmit: () => { } });
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
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
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = ({ click: {} },
    { onClick: (__VLS_ctx.fetchProjects) });
const { default: __VLS_54 } = __VLS_50.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "el-icon-search" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['el-icon-search']} */ ;
// @ts-ignore
[fetchProjects,];
var __VLS_50;
var __VLS_51;
let __VLS_55;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
const __VLS_61 = ({ click: {} },
    { onClick: (__VLS_ctx.resetFilters) });
const { default: __VLS_62 } = __VLS_58.slots;
// @ts-ignore
[resetFilters,];
var __VLS_58;
var __VLS_59;
// @ts-ignore
[];
var __VLS_44;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_63;
/** @ts-ignore @type {typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components.elTable | typeof __VLS_components.ElTable} */
elTable;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    data: (__VLS_ctx.projects),
    stripe: (true),
    border: true,
    maxHeight: "600",
    showOverflowTooltip: (true),
    ...{ style: {} },
}));
const __VLS_65 = __VLS_64({
    data: (__VLS_ctx.projects),
    stripe: (true),
    border: true,
    maxHeight: "600",
    showOverflowTooltip: (true),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    prop: "project_id",
    label: "项目ID",
    width: "180",
}));
const __VLS_71 = __VLS_70({
    prop: "project_id",
    label: "项目ID",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    prop: "user_id",
    label: "用户ID",
    width: "220",
}));
const __VLS_76 = __VLS_75({
    prop: "user_id",
    label: "用户ID",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
let __VLS_79;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    prop: "title",
    label: "标题",
    width: "180",
}));
const __VLS_81 = __VLS_80({
    prop: "title",
    label: "标题",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
{
    const { default: __VLS_85 } = __VLS_82.slots;
    const [{ row }] = __VLS_vSlot(__VLS_85);
    let __VLS_86;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        content: (row.title || '无'),
        placement: "top",
    }));
    const __VLS_88 = __VLS_87({
        content: (row.title || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.title || '无');
    // @ts-ignore
    [projects, vLoading, loading,];
    var __VLS_89;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_82;
let __VLS_92;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    prop: "video_url",
    label: "视频URL",
    width: "220",
}));
const __VLS_94 = __VLS_93({
    prop: "video_url",
    label: "视频URL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_97 } = __VLS_95.slots;
{
    const { default: __VLS_98 } = __VLS_95.slots;
    const [{ row }] = __VLS_vSlot(__VLS_98);
    let __VLS_99;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        content: (row.video_url || '无'),
        placement: "top",
    }));
    const __VLS_101 = __VLS_100({
        content: (row.video_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    const { default: __VLS_104 } = __VLS_102.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.video_url || '无');
    // @ts-ignore
    [];
    var __VLS_102;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_95;
let __VLS_105;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    prop: "key_concept",
    label: "核心创意",
    width: "250",
}));
const __VLS_107 = __VLS_106({
    prop: "key_concept",
    label: "核心创意",
    width: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
{
    const { default: __VLS_111 } = __VLS_108.slots;
    const [{ row }] = __VLS_vSlot(__VLS_111);
    let __VLS_112;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        content: (row.key_concept || '无'),
        placement: "top",
    }));
    const __VLS_114 = __VLS_113({
        content: (row.key_concept || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const { default: __VLS_117 } = __VLS_115.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.key_concept || '无');
    // @ts-ignore
    [];
    var __VLS_115;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_108;
let __VLS_118;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    prop: "poster_url",
    label: "海报URL",
    width: "220",
}));
const __VLS_120 = __VLS_119({
    prop: "poster_url",
    label: "海报URL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
    let __VLS_125;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        content: (row.poster_url || '无'),
        placement: "top",
    }));
    const __VLS_127 = __VLS_126({
        content: (row.poster_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    const { default: __VLS_130 } = __VLS_128.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.poster_url || '无');
    // @ts-ignore
    [];
    var __VLS_128;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_121;
let __VLS_131;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    prop: "share_code",
    label: "分享码",
    width: "180",
}));
const __VLS_133 = __VLS_132({
    prop: "share_code",
    label: "分享码",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_136;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    prop: "user_prompt",
    label: "用户输入",
    width: "300",
}));
const __VLS_138 = __VLS_137({
    prop: "user_prompt",
    label: "用户输入",
    width: "300",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
{
    const { default: __VLS_142 } = __VLS_139.slots;
    const [{ row }] = __VLS_vSlot(__VLS_142);
    let __VLS_143;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
        content: (row.user_prompt || '无'),
        placement: "top",
    }));
    const __VLS_145 = __VLS_144({
        content: (row.user_prompt || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    const { default: __VLS_148 } = __VLS_146.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.user_prompt || '无');
    // @ts-ignore
    [];
    var __VLS_146;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_139;
let __VLS_149;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    prop: "cover_url",
    label: "封面URL",
    width: "220",
}));
const __VLS_151 = __VLS_150({
    prop: "cover_url",
    label: "封面URL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
const { default: __VLS_154 } = __VLS_152.slots;
{
    const { default: __VLS_155 } = __VLS_152.slots;
    const [{ row }] = __VLS_vSlot(__VLS_155);
    let __VLS_156;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
        content: (row.cover_url || '无'),
        placement: "top",
    }));
    const __VLS_158 = __VLS_157({
        content: (row.cover_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    const { default: __VLS_161 } = __VLS_159.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.cover_url || '无');
    // @ts-ignore
    [];
    var __VLS_159;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_152;
let __VLS_162;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
    prop: "thumbnail_url",
    label: "缩略图URL",
    width: "220",
}));
const __VLS_164 = __VLS_163({
    prop: "thumbnail_url",
    label: "缩略图URL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
const { default: __VLS_167 } = __VLS_165.slots;
{
    const { default: __VLS_168 } = __VLS_165.slots;
    const [{ row }] = __VLS_vSlot(__VLS_168);
    let __VLS_169;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
        content: (row.thumbnail_url || '无'),
        placement: "top",
    }));
    const __VLS_171 = __VLS_170({
        content: (row.thumbnail_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    const { default: __VLS_174 } = __VLS_172.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.thumbnail_url || '无');
    // @ts-ignore
    [];
    var __VLS_172;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_165;
let __VLS_175;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    prop: "banner_url",
    label: "BannerURL",
    width: "220",
}));
const __VLS_177 = __VLS_176({
    prop: "banner_url",
    label: "BannerURL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
const { default: __VLS_180 } = __VLS_178.slots;
{
    const { default: __VLS_181 } = __VLS_178.slots;
    const [{ row }] = __VLS_vSlot(__VLS_181);
    let __VLS_182;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
        content: (row.banner_url || '无'),
        placement: "top",
    }));
    const __VLS_184 = __VLS_183({
        content: (row.banner_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    const { default: __VLS_187 } = __VLS_185.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.banner_url || '无');
    // @ts-ignore
    [];
    var __VLS_185;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_178;
let __VLS_188;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    prop: "share_poster_url",
    label: "分享海报URL",
    width: "220",
}));
const __VLS_190 = __VLS_189({
    prop: "share_poster_url",
    label: "分享海报URL",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const { default: __VLS_193 } = __VLS_191.slots;
{
    const { default: __VLS_194 } = __VLS_191.slots;
    const [{ row }] = __VLS_vSlot(__VLS_194);
    let __VLS_195;
    /** @ts-ignore @type {typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip} */
    elTooltip;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        content: (row.share_poster_url || '无'),
        placement: "top",
    }));
    const __VLS_197 = __VLS_196({
        content: (row.share_poster_url || '无'),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    const { default: __VLS_200 } = __VLS_198.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.share_poster_url || '无');
    // @ts-ignore
    [];
    var __VLS_198;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_191;
let __VLS_201;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    prop: "created_at",
    label: "创建时间",
    width: "180",
}));
const __VLS_203 = __VLS_202({
    prop: "created_at",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
const { default: __VLS_206 } = __VLS_204.slots;
{
    const { default: __VLS_207 } = __VLS_204.slots;
    const [{ row }] = __VLS_vSlot(__VLS_207);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (row.created_at ? new Date(row.created_at).toLocaleString() : '无');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_204;
let __VLS_208;
/** @ts-ignore @type {typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn} */
elTableColumn;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    prop: "updated_at",
    label: "更新时间",
    width: "180",
}));
const __VLS_210 = __VLS_209({
    prop: "updated_at",
    label: "更新时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
{
    const { default: __VLS_214 } = __VLS_211.slots;
    const [{ row }] = __VLS_vSlot(__VLS_214);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (row.updated_at ? new Date(row.updated_at).toLocaleString() : '无');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_211;
// @ts-ignore
[];
var __VLS_66;
if (__VLS_ctx.total > __VLS_ctx.pageSize) {
    let __VLS_215;
    /** @ts-ignore @type {typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination} */
    elPagination;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next",
        currentPage: (__VLS_ctx.page),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        ...{ class: "pagination" },
    }));
    const __VLS_217 = __VLS_216({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next",
        currentPage: (__VLS_ctx.page),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
        ...{ class: "pagination" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    let __VLS_220;
    const __VLS_221 = ({ currentChange: {} },
        { onCurrentChange: (__VLS_ctx.handlePageChange) });
    /** @type {__VLS_StyleScopedClasses['pagination']} */ ;
    var __VLS_218;
    var __VLS_219;
}
// @ts-ignore
[total, total, pageSize, pageSize, page, handlePageChange,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
