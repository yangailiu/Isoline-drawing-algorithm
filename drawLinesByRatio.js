/* 这里面的方法和sequenceOrigin里的原始方法区别较大，对运行速度进行了优化 */
/* 由之前的每次只检测一个target，变为每次对每个三角形检测所有的targets */
/* 将一个target对应的所有点坐标用一个数组保存起来，数组元素无重复，减少边排序的计算量 */
/* 和原始方法一样，将所有点的邻接点保存在一个对象中，对象的查找方法与之前不同 */
/* 原始方法将点的x+"+"+y作为键，本脚本中的方法用点在数组中的索引作为键 */

/* Find_edges_of_same_high方法接收所有初始点、delaunay输出结果以及所有targets */
/* 返回值为两个 */
/* 一个是所有的边，用于后续在画布上的绘制 */
/* 另一个是一个对象，该对象又包含两个对象，一个是所有等高点集，另一个是所有点的邻接点 */
/* 以上两个对象都以targets高程值为键作为分类，每个高程值对应的点的邻接点分别保存 */

/* Draw_lines方法用于绘制等高线，代码简单不加赘述 */

/* 注意一下第46行，需要根据输入数据的高程值范围进行选择更改 */

let Draw_lines_by_ratio
(function()
{
    //将Delaunay的结果三个三个分为一组，返回一个数组，数组每一项都是三个元素，每个元素都是一个索引，指向初始vertices中的某一点
    function get_three_points(triangles)
    {
        let idxArr = []
        for(i = triangles.length;i;)
        {
            idxArr.push([triangles[--i],triangles[--i],triangles[--i]])
        }
        return idxArr
    }

    //传入三个点，两两组成一条边，在每一条边上查找是否有等高线穿过，如果有，就将两点组成的边加入到相应的等高线集合中
    function find_two_points(idx,targets,vertices,allEdges)
    {
        let i,j,nums = [0,1,2,0,1],points
        
        for(i = 0;i<targets.length;i++)
        {
            for(j = 0;j<3;j++)
            {
                if(vertices[idx[j]][2]==targets[i])
                {
                    //注意！！！这里的1可以根据targets的大小范围更改，但是不可以太小，不然在后续的计算中加了和没加没有区别
                    //记得设置1为其他值之后，检查一下Find_edges_of_same_high输出的obj是否存在一个点有两个以上邻接点的情况
                    //如果有的话很可能是因为这里的1设置的太小了，因为之前这里设置的0.1，导致运算结果四舍五入之后没有差别，一个点有四个邻接点
                    vertices[idx[j]][2] += 1
                }
            }
        }

        for(i = 0;i<targets.length;i++)
        {
            points = []
            
            for(j = 0;j<3;j++)
            {
                if((targets[i]>Math.min(vertices[idx[j]][2],vertices[idx[nums[j+1]]][2])) && 
                    (targets[i]<Math.max(vertices[idx[j]][2],vertices[idx[nums[j+1]]][2])))
                {
                    point = find_place(vertices[idx[j]],vertices[idx[nums[j+1]]],targets[i])
                    points.push(point)
                    //if(point[0]==2834.314 && point[1]==1739.325) console.log(idx,[vertices[idx[0]],vertices[idx[1]],vertices[idx[2]]],points)
                }
            }
            if(points.length != 0)
            {
                allEdges[targets[i]].push(points)
            }
        }
        return allEdges
    }

    //根据已知的两点找到目标点的位置
    function find_place([x1,y1,z1],[x2,y2,z2],target)
    {
        let x,y,ratio
        ratio = (target-z1)/(z2-z1)
        x = x1+(x2-x1)*ratio
        y = y1+(y2-y1)*ratio
        return [Number(x.toFixed(3)),Number(y.toFixed(3)),target]
    }

    //将传入的边加入到三个集合中，方便后续查找和继续添加
    function insert_edge(edge,allPoints,obj,idxForm) 
    {
        let [a,b] = edge
        let idxA,idxB
        if(idxForm[a[0]+"+"+a[1]] == undefined)
        {
            idxA = allPoints.length
            idxForm[a[0]+"+"+a[1]] = idxA
            allPoints.push(a)
            obj[idxA] = []
        }
        if(idxForm[b[0]+"+"+b[1]] == undefined)
        {
            idxB = allPoints.length
            idxForm[b[0]+"+"+b[1]] = idxB
            allPoints.push(b)
            obj[idxB] = []
        }
        idxA = idxForm[a[0]+"+"+a[1]]
        idxB = idxForm[b[0]+"+"+b[1]]
        obj[idxA].push(idxB)
        obj[idxB].push(idxA)
        return {allPoints:allPoints,obj:obj,idxForm:idxForm}
    }

    Draw_lines_by_ratio =
    {
        //输入原始点集，Delaunay三角剖分的结果以及所有目标高程值
        Find_edges_of_same_high : function(vertices,triangles,targets)
        {
            let idxArr,i,j,allEdges = {}
            idxArr = get_three_points(triangles)

            //初始化所有目标高程值在对象中所对应的属性为空数组
            for(i = 0;i<targets.length;i++)
            {
                allEdges[targets[i]] = []
            }
            //查找所有边上是否有所需高程值的点，如果有则加入对象中对应的高程值属性中
            for(i = 0;i<idxArr.length;i++)
            {
                allEdges = find_two_points(idxArr[i],targets,vertices,allEdges)
            }
            //console.log(allEdges)

            //将每个点和及点的相邻点以索引的方式分别存储起来
            let edges,edge,allPoints,obj,idxForm,allObj = {}
            for(i = 0;i<targets.length;i++)
            {
                allPoints = []
                obj = {}
                idxForm = {}
                edges = allEdges[targets[i]]
                for(j = 0;j<edges.length;j++)
                {
                    edge = edges[j]
                    result = insert_edge(edge,allPoints,obj,idxForm)
                    allPoints = result.allPoints
                    obj = result.obj
                    idxForm = result.idxForm
                }
                //console.log(allPoints,obj,idxForm)
                allObj[targets[i]] = {points:allPoints, obj:obj}
            }
            //console.log(allEdges)
            return {edges:allEdges,obj:allObj}
        },

        //绘制等高线
        Draw_lines : function(ctx,targets,objects)
        {
            let lines
            ctx.strokeStyle="#191970"
            for(let j = 0;j<targets.length;j++)
            {    
                if(objects[targets[j]].length!=0)
                {
                    lines = objects[targets[j]]
                    for(let i = 0;i<lines.length;i++)
                    {
                        // ctx.strokeText(lines[i][0][2],lines[i][1][0], lines[i][1][1]);
                        // ctx.strokeText(lines[i][1][2],lines[i][1][0], lines[i][1][1]);
                        ctx.beginPath()
                        ctx.moveTo(lines[i][0][0], lines[i][0][1])
                        ctx.lineTo(lines[i][1][0], lines[i][1][1])
                        ctx.stroke()
                    }
                }
            }
        }
    }
}())