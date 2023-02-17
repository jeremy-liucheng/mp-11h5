<script lang="ts" setup>
import { ref, defineEmits } from 'vue';
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus';
import { read, utils } from 'xlsx';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const emit = defineEmits<{
  (e: 'uploadSuccess', args: any): void;
}>();
const wb = ref();
const httpRequest = (e: any) => importExcel(e.file);

const file2Xce = (file: Blob) => {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target?.result;
      wb.value = read(data, {
        type: 'binary'
      });
      const result: any = [];
      wb.value.SheetNames.forEach((sheetName: string | number) => {
        result.push({
          sheetName: sheetName,
          sheet: utils.sheet_to_json(wb.value.Sheets[sheetName])
        });
      });
      console.log(result);
      resolve(result);
    };
    reader.readAsBinaryString(file);
  });
};

const importExcel = (param: any) => {
  return new Promise((resolve, reject) => {
    file2Xce(param)
      .then((item: any) => {
        if (item && item.length > 0) {
          // xlsxJson就是解析出来的json数据,数据格式如下
          // [{sheetName: sheet1, sheet: sheetData }]
          if (item[0] && item[0].sheet && item[0].sheet.length) {
            const sheetArray = item[0].sheet;
            sheetArray.forEach((e: any, i: number) => {
              Object.entries(e).forEach(([colKey, val]) => {
                const [, key] = colKey.split(':');
                sheetArray[i][key] = val;
                delete sheetArray[i][colKey];
              });
            });
            emit('uploadSuccess', sheetArray);
            resolve({ error: 0 });
          }
        }
      })
      .catch(error => {
        reject({ error });
      });
  });
};

const fileList = ref<UploadUserFile[]>([]);

const handleExceed: UploadProps['onExceed'] = () =>
  ElMessage.warning('超出最大数量3，请关闭弹窗重新打开上传！');
</script>
<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload"
    action=""
    drag
    :http-request="httpRequest"
    :multiple="false"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    :limit="3"
    :on-exceed="handleExceed"
  >
    <el-icon class="el-icon--upload">
      <svg-icon name="yunshangchuan" />
    </el-icon>
    <div class="el-upload__text">拖动文件至此处或 <em>点击上传</em></div>
    <template #tip>
      <slot name="tip" />
    </template>
  </el-upload>
</template>

<style lang="scss" scoped>
.upload {
  margin-left: 10px;
}
</style>
