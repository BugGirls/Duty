// 网上作答

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 题库管理</el-breadcrumb-item>
                <el-breadcrumb-item>网上作答</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class='problem'>
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-select v-model="selectedType" @change="selectType" placeholder="选择分类">
                            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="16">
                        <el-card class="box-card">
                            <div slot="header">
                                <el-row>
                                    <el-col :span="2">题目</el-col>
                                    <el-col :span="18" style="text-align:left;font-size:14px;line-height:1.5">
                                        {{problemData.title}}
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button size='small' type="primary" @click="nextProblem">下一题</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-button v-show="!isShowAnswer" plain size='small' @click="seeAnswer">查看答案</el-button>
                            <el-row v-show="isShowAnswer">
                                <el-col :span="2">答案</el-col>
                                <el-col :span="22" style="line-height:1.5;text-align:left;font-size:14px;">
                                    {{problemData.answer}}
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 重来提示框 -->
        <el-dialog title="提示" :visible.sync="againVisible" width="300px" center>
            <div class="del-dialog-cnt">已是最后一题，是否再来一遍？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="againVisible = false">取 消</el-button>
                <el-button type="primary" @click="againQuestion">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: "problem",
    data() {
        return {
            isShowAnswer: false,
            againVisible: false,
            categoryList: [],
            questionList: [],
            selectedType: "",
            problemData: {
                title: "题目",
                answer: "答案"
            }
        }
    },
    mounted() {
        this.loadCategorySelect()
    },
    methods: {
        // 加载试题分类选择列表
        loadCategorySelect() {
            let postData = this.$qs.stringify({
                status: 1
            })
            this.$axios({
                method: 'post',
                url: '/questionCategory/get_list_by_param.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    _.forEach(res.data.data, (item) => {
                        let option = {
                            value: item.id,
                            label: item.title
                        }
                        this.categoryList.push(option)
                    })

                    // 初始化选择试题分类并显示试题列表
                    this.selectedType = this.categoryList[0].value
                    this.loadQuestionListByCategory()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        selectType() {
            this.loadQuestionListByCategory()
        },
        // 加载选择试题分类下的试题列表
        loadQuestionListByCategory() {
            let postData = this.$qs.stringify({
                categoryId: this.selectedType
            })
            this.$axios({
                method: 'post',
                url: '/question/list.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.questionList = res.data.data
                    let data = {
                        title: this.questionList[0].subject,
                        answer: this.questionList[0].answer
                    };
                    this.problemData = data;
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 随机从数组中取出几个元素
        // getRandomArrayElements(arr, count) {
        //     var shuffled = arr.slice(0),
        //         i = arr.length,
        //         min = i - count,
        //         temp, index;
        //     while(i-- > min) {
        //         index = Math.floor((i + 1) * Math.random());
        //         temp = shuffled[index];
        //         shuffled[index] = shuffled[i];
        //         shuffled[i] = temp;
        //     }
        //     return shuffled.slice(min);
        // },
        seeAnswer() {
            this.isShowAnswer = true;
        },
        nextProblem() {
            this.isShowAnswer = false;
            if (this.questionList.length == 1) {
                // 如果等于1，则为最后一题，显示重来提示框
                this.againVisible = true
            } else {
                this.questionList.shift()
                let data = {
                    title: this.questionList[0].subject,
                    answer: this.questionList[0].answer
                }
                this.problemData = data
            }
        },
        againQuestion() {
            this.loadQuestionListByCategory()
            this.againVisible = false
        }
    }
}
</script>

<style>

</style>
