import request from '@/utils/request.js'
import Vue from 'vue';
// 需要安装element-tree-grid这个库
import ElTreeGrid from 'element-tree-grid';

Vue.component(ElTreeGrid.name, ElTreeGrid);

export default {
  data() {
    return {
      tableData: [],
      // 添加商品分类的，父分类列表
      level2List: [],
      // 添加商品分类的时候，选中项绑定值，是一个数组
      selectedPIds: [],
      loading: false,
      editCategoryVisible: false,
      addCategoryVisible: false,
      formData: {
        cat_id: -1,
        cat_pid: -1,
        cat_name: ''
      },
      formAddData: {
        cat_name: '',
        selectedPIds: [],
        cat_pid: 0,
        cat_level: 0
      },
      // 分页数据
      pagesize: 5,
      pagenum: 1,
      total: 0
    };
  },
  mounted() {
    this.loadData();
    this.loadLevel2List();
  },
  methods: {
    // 添加商品分类的，父分类列表
    async loadLevel2List() {
      const res = await request.get('/categories?type=2');
      if (res.meta.status === 200) {
        this.level2List = res.data;
      }
    },
    // 处理分页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 加载商品分类数据列表
    async loadData() {
      this.loading = true;
      const res = await request.get('/categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      if (res.meta.status === 200) {
        this.loading = false;
        this.tableData = res.data.result;
        this.total = res.data.total;
      } else {
        this.loading = false;
        this.$message({
          type: 'error',
          message: '获取数据失败'
        });
      }
    },
    // 删除分类
    async handleDelete(catId) {
      this.$confirm('是否删除此商品分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await request.delete(`/categories/${catId}`);
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 打开编辑窗口
    async openEditDialog(cat) {
      this.editCategoryVisible = true;
      this.formData.cat_name = cat.cat_name;
      this.formData.cat_id = cat.cat_id;
    },
    // 修改商品分类
    async handleEdit() {
      const res = await request.put(`/categories/${this.formData.cat_id}`, {
        cat_name: this.formData.cat_name
      });
      if (res.meta.status === 200) {
        this.editCategoryVisible = false;
        this.loadData();
        this.$message({
          type: 'success',
          message: '编辑分类成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '编辑分类失败'
        });
      }
    },
    async handleAdd() {
      const length = this.formAddData.selectedPIds.length;
      this.formAddData.cat_level = length;
      switch (length) {
        case 0:
          this.formAddData.cat_pid = 0;
          break;
        case 1:
          this.formAddData.cat_pid = this.formAddData.selectedPIds[0];
          break;
        case 2:
          this.formAddData.cat_pid = this.formAddData.selectedPIds[1];
          break;
        default:
      }

      const res = await request.post('categories', this.formAddData);
      if (res.meta.status === 201) {
        this.loadData();
        this.loadLevel2List();
        this.addCategoryVisible = false;
        this.$message({
          type: 'success',
          message: '添加商品分类成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '添加商品分类失败'
        });
      }
    }
  }
};