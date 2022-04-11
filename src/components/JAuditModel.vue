<template>
  <a-modal :title="title" :visible="visible" closable :width="width" @ok="handleOk" @cancel="handleCancel"
    :confirm-loading="confirmLoading">
    <a-form-model :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
      <a-form-model-item label='审核结果:'>
        <j-dict-select-tag v-model="form.approve_status" dictCode="approve_status" hideDefault></j-dict-select-tag>
      </a-form-model-item>
      <a-form-model-item label='市级审核意见:' v-if="auditAuthType=='city'">
        <a-textarea v-model="form.city_audit_opinion" :auto-size="{ minRows: 2, maxRows: 5 }"></a-textarea>
      </a-form-model-item>
      <a-form-model-item label='省级审核意见:' v-if="auditAuthType=='province'">
        <a-textarea v-model="form.province_audit_opinion" :auto-size="{ minRows: 2, maxRows: 5 }"></a-textarea>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { putAction } from '@/api/manage'

export default {
  name: 'JAuditModel',
  data() {
    return {
      title: '审核',
      isSingle: true, // 是否单个操作
      visible: false,
      confirmLoading: false,
      width: 600,
      rows: [], // 需要审核的数据
      requestUrl: '',
      form: {
        approve_status: '1',
        province_audit_opinion: '',
        city_audit_opinion: '',
      },
      auditAuthType: '', // 审核权限类型  city  province
    }
  },
  methods: {
    showModal() {
      let nowRows = this.rows
      if (this.isSingle) {
        if (!nowRows || 0 == nowRows.length || nowRows.length > 1) return void this.$message.warning("请选择一条数据");
      } else {
        if (!nowRows || 0 == nowRows.length) return void this.$message.warning("请选择数据");
      } 
      if (this.auditAuthType == 'city') {
        for (let obj of nowRows) {
          if (obj.audit_status != '1') {
            this.$message.info(this.isSingle ? '无法进行市级审核操作' : '存在无法进行市级审核操作的选项！');
            return false;
          }
        }
      } else if (this.auditAuthType == 'province') {
        for (let obj of nowRows) {
          if (obj.audit_status != '3') {
            this.$message.info(this.isSingle ? '无法进行省级审核操作' : '存在无法进行省级审核操作的选项！');
            return false;
          }
        }
      }
      this.visible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      let newParma = [];
      for (let obj of this.rows) {
        newParma.push({
          id: obj.id,
          audit_status: obj.audit_status,
          approve_status: this.form.approve_status,
          province_audit_opinion: this.form.province_audit_opinion,
          city_audit_opinion: this.form.city_audit_opinion,
        })
      }
      putAction(this.requestUrl, newParma).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
            if (this.onOk) this.onOk()
          }, 200);
        } else {
          this.$message.warning(res.message);
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
            if (this.onOk) this.onOk()
          }, 200);
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
}
</script>
