/* 该文件定义对象Get_vertices，其中包含四种不同的数据集 */

/* get_ramdon_2d_vertices(points_sum)方法返回‘points_sum’个随机二维坐标 */
/* get_ramdon_3d_vertices(points_sum)方法返回‘points_sum’个随机三维坐标 */
/* get_some_test_vertices(origin_points)方法将[0,10]范围内的原始坐标处理为符合规范的点坐标 */
/* get_complex_data(datas)将datas处理为标准坐标 */


var Get_vertices
(function(){
    //求所有数据x，y坐标的最大最小值，并将z坐标规范化处理
    function getOuterData(data)
    {
        let new_data = []
        let all_datas = []
        let i,x,y,z,min_x=1000000,max_x=0,min_y=10000000,max_y=0,min_z=1000000,max_z=0
        for(i = 0;i<data.length;i++){
            // 检查异常点并排除
            // if(data[i][2]>10) console.log(data[i][2])
            // if(data[i][2]<0) console.log(data[i][2])
            // if(data[i][2]>10||data[i][2]<-2.25)
            // {
            //     console.log('点',data[i],'与其他点高程值差距很大')
            // }

            new_data = []
            x = Number(data[i][0])
            y = Number(data[i][1])
            z = Number(data[i][2])*1000

            min_x = Math.min(x,min_x)
            max_x = Math.max(x,max_x)
            min_y = Math.min(y,min_y)
            max_y = Math.max(y,max_y)
            min_z = Math.min(z,min_z)
            max_z = Math.max(z,max_z)

            new_data.push(x)
            new_data.push(y)
            new_data.push(Math.round(z))
            //console.log(new_data)
            all_datas.push(new_data)
        }
        return  {
                    vertices : all_datas,
                    min_x : Math.floor(min_x),
                    max_x : Math.ceil(max_x),
                    min_y : Math.floor(min_y),
                    max_y : Math.ceil(max_y),
                    min_z : min_z,
                    max_z : max_z
                }
    }

    Get_vertices = 
    {
        get_ramdon_2d_vertices : function(canvas,points_sum){
            let vertices = []
            let i,x,y
            for(i = points_sum; i--; ) 
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

        get_ramdon_3d_vertices : function(canvas,points_sum)
        {
            let vertices = []
            let i,x,y
            for(i = points_sum; i--; )
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

        // get_160000_datas : function(datas)
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

        get_some_test_vertices : function(origin_points)
        {
            let i,x,y,z
            let vertices = []
            for(i = origin_points.length; i--; ) 
            {
                x = origin_points[i][0].toFixed(3)*1000/10
                y = origin_points[i][1].toFixed(3)*1000/10
                z = origin_points[i][2]
                vertices[i] = [x, y, z]
            }
            return vertices
        },

        //处理大量测试数据为标准数据
        get_complex_vertices : function(datas)
        {
            let i,new_datas,vertice = [],vertices = [],
                min_x,max_x,min_y,max_y,min_z,max_z
                //x_range,y_range,z_range

            new_datas = getOuterData(datas)
            vertices = new_datas.vertices
            min_x = new_datas.min_x
            max_x = new_datas.max_x
            min_y = new_datas.min_y
            max_y = new_datas.max_y
            min_z = new_datas.min_z
            max_z = new_datas.max_z

            // console.log(getOuterData(datas))
            x_range = max_x-min_x
            y_range = max_y-min_y
            console.log('x最小值=',min_x,'x最大值=',max_x,'x范围大约是：',x_range)
            console.log('y最小值=',min_y,'y最大值=',max_y,'y范围大约是：',y_range)
            console.log('z最小值=',min_z,'z最大值=',max_z)

            for(i = 0;i<vertices.length;i++){
                vertice = vertices[i]
                // vertice[0] = (vertice[0]-min_x)/20
                // vertice[1] = (vertice[1]-min_y)/20
                vertice[0] = Number(((vertice[0]-min_x)/20).toFixed(3))
                vertice[1] = Number(((vertice[1]-min_y)/20).toFixed(3))
            }
            return vertices
        }
    }
    if (typeof module !== "undefined")
        module.exports = Get_vertices
})();