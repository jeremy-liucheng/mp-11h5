<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus';
import { uploadCopyright } from '@/service/api/game';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const props = defineProps<{
  params: any;
}>();
const { params } = toRefs(props);

const httpRequest = (file: any) => getUploadKey(file);

const getUploadKey = async (file: any) => {
  const { gameid, type } = params.value;
  const fileData = new FormData();
  fileData.append('file', file.file);
  const [, err] = await uploadCopyright({
    isFormData: true,
    gameid,
    type,
    params: fileData
  });
  let elMsgObj: any = {
    message: '上传成功',
    grouping: true,
    type: 'success'
  };
  if (err) {
    elMsgObj = {
      message: err,
      grouping: true,
      type: 'danger'
    };
  }
  ElMessage(elMsgObj);
};

const exampleUrl = ref(
  [
    'https://mp.11h5.com/images/copyright_file.jpg',
    'https://mp.11h5.com/images/copyright_certificate.jpg'
  ][params.value.type]
);
const fileList = ref<UploadUserFile[]>([]);

const handleExceed: UploadProps['onExceed'] = () =>
  ElMessage.warning('超出最大数量1，请关闭弹窗重新打开上传！');
</script>
<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload"
    action=""
    drag
    :http-request="httpRequest"
    :multiple="false"
    accept="*"
    :limit="1"
    :on-exceed="handleExceed"
  >
    <el-row justify="center" class="flex-hc">
      <el-col :span="11">
        <el-icon class="el-icon--upload">
          <svg-icon name="yunshangchuan" />
        </el-icon>
        <div class="el-upload__text">拖动文件pdf或图片至此处或 <em>点击上传</em></div>
        <template #tip>
          <slot name="tip" />
        </template>
      </el-col>
      <el-col :span="11">
        <el-link type="danger">样例：</el-link>
        <el-image style="width: 100%; height: 100%" :src="exampleUrl" />
      </el-col>
    </el-row>
  </el-upload>
</template>

<style lang="scss" scoped>
.upload {
  margin-left: 10px;
}
</style>
