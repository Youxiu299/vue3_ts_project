<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="SpuParams.tmId">
                <el-option v-for="item in AlltradeMark" :label="item.tmName" :value="item.id" :key="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" v-model="SpuParams.description" placeholder="请输入SPU描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU照片">
            <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
            -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :before-upload="handlerUpload" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select v-model="saleAttrIdAndValueName" style="width: 200px;"
                :placeholder="unSelectSaleAttr.length > 0 ? `还未选择${unSelectSaleAttr.length}个` : '无'">
                <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`" />
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
                type="primary" size="default" icon="Plus">添加属性值</el-button>
            <el-table border style="margin: 10px 0;" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值" show-overflow-tooltip>
                    <template #="{ row }">
                        <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <!-- toEdit -->
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                            placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
                        <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" @click="save"
                size="default">保存</el-button>
            <el-button size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { reqAllTradeMark, reqAddOrUpdateSpu, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu';
import { HasSaleArr, SaleAttr, SpuImg, Trademark, SpuData, SupHasImg, SaleAttrResponseData, HasSaleArrResponseData, AllTradeMark, SaleAttrValue } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

let $emit = defineEmits(['changeScene'])
//取消按钮 通知父组件切换场景为1
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
}

//存储已有的SPU这些数据 品牌
let AlltradeMark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleArr[]>([]);
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//存储预览图片地址
let dialogImageUrl = ref<string>('')
//存储已有SPU对象
let SpuParams = ref<SpuData>({
    category3Id: "",//三级分类ID
    spuName: "",//spu名
    description: "",//spu描述
    tmId: "",//品牌ID
    spuImageList: [],//spu图片
    spuSaleAttrList: []//属性
})
//将来收集还未选择的销售属性的ID和属性值的名字
let saleAttrIdAndValueName = ref<string>('')
//子组件方法
const initHasSpuData = async (spu: SpuData) => {
    //存储已有的SPU对象,将来在模板中展示
    SpuParams.value = spu;
    //spu父组件传递过来的已有SPU对象
    //获取全部品牌数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SupHasImg = await reqSpuImageList((spu.id as number));
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    //获取整个项目全部SPU的销售属性
    let result3: HasSaleArrResponseData = await reqAllSaleAttr();
    //存储全部品牌的数据
    AlltradeMark.value = result.data;
    //SPU对应商品图片
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //存储已有SPU销售属性
    saleAttr.value = result2.data
    //存储全部的销售属性
    allSaleAttr.value = result3.data
}
//照片墙点击预览按钮时触发的钩子
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url;
    //对话框弹起
    dialogVisible.value = true;
}
//照片上传成功前钩子 约束文件类型与大小
const handlerUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件需小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件需为PNG|JPG|GIF'
        })
        return false;
    }
}
//照片删除钩子 未写
const handleRemove = () => {

}
//计算出当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    //全部销售属性：颜色、版本、尺码
    let unSelectAttr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unSelectAttr
})
//添加销售属性的方法
const addSaleAttr = () => {
    /*
        "baseSaleAttrId": number,
        "saleAttrName": string,
        "spuSaleAttrValueList": SpuSaleAttrValueList
        */
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中
    saleAttr.value.push(newSaleAttr);
    //清空收集的数据
    saleAttrIdAndValueName.value = '';

}
//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
    //点击按钮的时候,input组件不就不出来->编辑模式
    row.flag = true;
    row.saleAttrValue = ''
}
//表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }

    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })

    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }


    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}

//保存按钮的回调
const save = async () => {
    //整理参数
    //发请求:添加SPU|更新已有的SPU
    //成功
    //失败
    //1:照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    });
    //2:整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        //通知父组件切换场景为0
        $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }


}
//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
        id: ''
    });
    //清空照片
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    let result1: HasSaleArrResponseData = await reqAllSaleAttr();
    //存储数据
    AlltradeMark.value = result.data;
    allSaleAttr.value = result1.data;
}
//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
