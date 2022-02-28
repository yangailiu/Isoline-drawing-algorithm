/* 该文件定义对象getVertices，其中包含四种不同的数据集 */

/* getRamdon2dVertices(pointsSum)方法返回‘pointsSum’个随机二维坐标 */
/* getRamdon3dVertices(pointsSum)方法返回‘pointsSum’个随机三维坐标 */
/* getSomeTestVertices(originPoints)方法将[0,10]范围内的原始坐标处理为符合规范的点坐标 */
/* getComplexVertices(datas)将datas处理为标准坐标 */


var getVertices
(function(){
    //求所有数据x，y坐标的最大最小值，并将z坐标规范化处理
    function getOuterData(data)
    {
        let newData = []
        let allDatas = []
        let i,x,y,z,minX=1000000,maxX=0,minY=10000000,maxY=0,minZ=1000000,maxZ=0
        for(i = 0;i<data.length;i++){
            // 检查异常点并排除
            // if(data[i][2]>10) console.log(data[i][2])
            // if(data[i][2]<0) console.log(data[i][2])
            // if(data[i][2]>10||data[i][2]<-2.25)
            // {
            //     console.log('点',data[i],'与其他点高程值差距很大')
            // }

            newData = []
            x = Number(data[i][0])
            y = Number(data[i][1])
            z = Number(data[i][2])*1000

            minX = Math.min(x,minX)
            maxX = Math.max(x,maxX)
            minY = Math.min(y,minY)
            maxY = Math.max(y,maxY)
            minZ = Math.min(z,minZ)
            maxZ = Math.max(z,maxZ)

            newData.push(x)
            newData.push(y)
            newData.push(Math.round(z))
            //console.log(newData)
            allDatas.push(newData)
        }
        return  {
                    vertices : allDatas,
                    minX : Math.floor(minX),
                    maxX : Math.ceil(maxX),
                    minY : Math.floor(minY),
                    maxY : Math.ceil(maxY),
                    minZ : minZ,
                    maxZ : maxZ
                }
    }

    getVertices = 
    {
        getRamdon2dVertices : function(canvas,pointsSum){
            let vertices = []
            let i,x,y
            for(i = pointsSum; i--; ) 
            {
                do 
                {
                    x = Math.random() - 0.5
                    y = Math.random() - 0.5
                } 
                while(x * x + y * y > 0.25)
                x = (x * 0.96875 + 0.5) * canvas.width
                y = (y * 0.96875 + 0.5) * canvas.height
                vertices[i] = [x, y]
            }
            return vertices
        },

        getRamdon3dVertices : function(canvas,pointsSum)
        {
            let vertices = []
            let i,x,y
            for(i = pointsSum; i--; )
            {
                do 
                {
                    x = Math.random() - 0.5
                    y = Math.random() - 0.5
                    z = Math.random()
                } 
                while(x * x + y * y > 0.25)
                x = (x * 0.96875 + 0.5) * canvas.width
                y = (y * 0.96875 + 0.5) * canvas.height
                z = (z * 100)
                vertices[i] = [x, y, z]
            }
            return vertices
        },

        // get160000Datas : function(datas)
        // {
        //     let i,x,y,z
        //     let vertices = []
        //     for(i = datas.length; i--; ) 
        //     {
        //         x = datas[i][0]*100/10
        //         y = datas[i][1]*100/10
        //         z = datas[i][2]
        //         vertices[i] = [x, y, z]
        //     }
        //     return vertices
        // },

        getSomeTestVertices : function(originPoints)
        {
            let i,x,y,z
            let vertices = []
            for(i = originPoints.length; i--; ) 
            {
                x = originPoints[i][0].toFixed(3)*1000/10
                y = originPoints[i][1].toFixed(3)*1000/10
                z = originPoints[i][2]
                vertices[i] = [x, y, z]
            }
            return vertices
        },

        //处理大量测试数据为标准数据
        getComplexVertices : function(datas)
        {
            let i,newDatas,vertice = [],vertices = [],
                minX,maxX,minY,maxY,minZ,maxZ
                //x_range,y_range,z_range

            newDatas = getOuterData(datas)
            vertices = newDatas.vertices
            minX = newDatas.minX
            maxX = newDatas.maxX
            minY = newDatas.minY
            maxY = newDatas.maxY
            minZ = newDatas.minZ
            maxZ = newDatas.maxZ

            // console.log(getOuterData(datas))
            x_range = maxX-minX
            y_range = maxY-minY
            console.log('x最小值=',minX,'x最大值=',maxX,'x范围大约是：',x_range)
            console.log('y最小值=',minY,'y最大值=',maxY,'y范围大约是：',y_range)
            console.log('z最小值=',minZ,'z最大值=',maxZ)

            for(i = 0;i<vertices.length;i++){
                vertice = vertices[i]
                // vertice[0] = (vertice[0]-minX)/20
                // vertice[1] = (vertice[1]-minY)/20
                vertice[0] = Number(((vertice[0]-minX)/20).toFixed(3))
                vertice[1] = Number(((vertice[1]-minY)/20).toFixed(3))
            }
            return vertices
        }
    }
    if (typeof module !== "undefined")
        module.exports = getVertices
})();