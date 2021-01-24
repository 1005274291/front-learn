'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const res=await uniCloud.httpclient.request("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=RkIl8a7iZUGySoandV6y4W1w&client_secret=G6RHtss3aiHKG15GyUvk1QGRIToqY4Bb",{
		dataType:"json"
	})
	const access_token = res.data.access_token
	const classify_res=await uniCloud.httpclient.request("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",{
		methods:"POST",
		dataType:"json",
		headers:{
			"Content-Type":"application/x-www-form-urlencoded"
		},
		data:{
			access_token:access_token,
			image:event.image
		}
	})
	//返回数据给客户端
	return classify_res.data
};
