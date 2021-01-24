<template>
	<view>
		<button type="default" @click="takePhoto">从相册或拍照获得照片</button>
		<image :src="imgurl" mode="widthFix" style="width: 100%;"></image>
		<view>{{keyword}}</view>
		<view v-if="searchResults">
			<view v-if="searchResults.matched" style="width: 100%;text-align: center;">{{searchResults.matched.typename}}</view>
			<view v-else style="font-size: 14px;">
				<view v-for="(item,index) in searchResults.similars" style="display: flex;">
					<view style="flex: 1;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right: 20px;">{{item.keywords}}</view>
					<view>{{item.typename}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgurl: "",
				keyword: "",
				searchResults: null
			}
		},
		onLoad() {

		},
		methods: {
			//1. 获取一张图片，从拍照或者从相册选择
			takePhoto() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.imgurl = res.tempFilePaths[0]
						this.image2base64(this.imgurl)
					}
				})
			},
			//2. 图片路径转base64
			image2base64(path) {
				//条件编译，针对打包环境类型进行有选择的编译
				#// #ifdef APP-PLUS
				console.log("Native")
				plus.io.resolveLocalFileSystemURL(path,(entry)=>{
					entry.file((file)=>{
						var reader=new plus.io.FileReader()
						reader.onloadend=async (e)=>{
							var base64=e.target.result.substr(22)
							this.imageClassify(base64)
						}
						reader.readAsDataURL(file)//转化成base64
					})
				})
				// #endif
				// #ifdef MP-WEIXIN
				console.log("微信")
				wx.getFileSystemManager().readFile({
					filePath: path,
					encoding: "base64",
					success: (res) => {
						this.imageClassify(res.data)
					}
				})
				// #endif
			},

			//3. 调用百度图像识别AI返回类别
			//apikey RkIl8a7iZUGySoandV6y4W1w
			//secretkey G6RHtss3aiHKG15GyUvk1QGRIToqY4Bb
			async imageClassify(ba4) {
				var [err, res] = await uni.request({
					url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=RkIl8a7iZUGySoandV6y4W1w&client_secret=G6RHtss3aiHKG15GyUvk1QGRIToqY4Bb",
				})
				var access_token = res.data.access_token;
				var [error, res] = await uni.request({
					url: "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
					method: "POST",
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data: {
						access_token: access_token,
						image: ba4
					}
				})
				this.parseResults(res.data.result)
				// uniCloud.callFunction({
				// 	name:"imageClassify",
				// 	data:{
				// 		image:ba4
				// 	},
				// 	success: (res) => {
				// 		console.log(res.result)
				// 		this.parseResults(res.result)
				// 	}
				// })
			},
			//4. 展示图像识别的的结果
			parseResults(result) {
				var itemList = []
				var result_Index; //ai识别出最像的下表，如果没有超过阈值的就让用户选择
				for (var i = 0; i < result.length; i++) {
					if (result[i].score > .7) {
						result_Index = i
						break
					}
					itemList.push(result[i].keyword + "" + result[i].score)
				}
				if (result_Index >= 0) {
					this.searchKeyword(result[result_Index].keyword)
					return
				}
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						this.searchKeyword(result[res.tapIndex].keyword)
					}
				})
			},
			//5. 使用图片识别的结果去查询垃圾分类并展示
			searchKeyword(kw) {
				this.keyword = kw
				uniCloud.callFunction({
					name: "TrashClassify",
					data: {
						keyword: kw
					},
					success: (res) => {
						console.log(res.result)
						this.searchResults = res.result
					}
				})
			}
			//6. 打包发布，ios，Android，微信小程序
		}
	}
</script>

<style>

</style>
