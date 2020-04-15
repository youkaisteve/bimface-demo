<template>
  <div class="model-management">
    <el-row>
      <el-col :span="24" class="header">
        <span>模型管理</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" class="filter">
        <span class="label">上传日期</span>
        <span class="data">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </span>
      </el-col>
      <el-col :span="8"></el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </div>
</template>
<style lang="less" scoped>
.model-management {
  .header {
    color: #091732;
    font-size: 20px;
    padding: 24px 22px 24px 15px;
  }
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .label {
      width: 85px;
    }
    .data {
      flex: 1;
    }
  }
}
</style>