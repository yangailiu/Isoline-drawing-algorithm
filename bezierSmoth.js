let bezierSmoth
(function()
{
    //当点的索引是通过sequense得到的，则用下面的方法
    function drawLinesOrigin(vertices, allIdx, ctx) 
    {
        let i, len = allIdx.length
        for(i = 0;i<len-3;i+=3)
        {
            ctx.strokeStyle="#191970"
            ctx.moveTo(vertices[allIdx[i]][0],vertices[allIdx[i]][1])
            ctx.bezierCurveTo(  vertices[allIdx[i+1]][0],vertices[allIdx[i+1]][1],
                                vertices[allIdx[i+2]][0],vertices[allIdx[i+2]][1],
                                vertices[allIdx[i+3]][0],vertices[allIdx[i+3]][1])
        }
        // ctx.bezierCurveTo(  vertices[allIdx[len-3]][0],vertices[allIdx[len-3]][1],
        //                     vertices[allIdx[len-2]][0],vertices[allIdx[len-2]][1],
        //                     vertices[allIdx[len-1]][0],vertices[allIdx[len-1]][1])
        ctx.lineTo(vertices[allIdx[len-1]][0],vertices[allIdx[len-1]][1])
        ctx.stroke()
    }

    //对于已经排列好顺序的点坐标组成的数组，用下面的方法可直接根据点绘制曲线
    function drawLines(vertices,ctx)
    {
        let i,len = vertices
        for(i = 0;i<len-3;i+=3)
        {
            ctx.strokeStyle="#191970"
            ctx.moveTo(vertices[i][0],vertices[i][1])
            ctx.bezierCurveTo(  vertices[i+1][0],vertices[i+1][1],
                                vertices[i+2][0],vertices[i+2][1],
                                vertices[i+3][0],vertices[i+3][1])
        }
        // ctx.bezierCurveTo(  vertices[len-3][0],vertices[len-3][1],
        //                     vertices[len-2][0],vertices[len-2][1],
        //                     vertices[len-1][0],vertices[len-1][1])
        ctx.lineTo(vertices[len-1][0],vertices[len-1][1])
        ctx.stroke()
    }

    //根据两点查找中点
    function middle(vertice1,vertice2)
    {
        let x = Number(((vertice1[0]+vertice2[0])/2).toFixed(3))
        let y = Number(((vertice1[1]+vertice2[1])/2).toFixed(3))
        return [x,y,vertice1[2]]
    }

    //将一条折线分解为所需的几个数组bezierPoint, bezierIdx, bezierFunction(暂时先不管，等值线填充应该会用到), bezierControl（其中包含多个数组，每个数组包含四个点，用于绘制bezier曲线）
    function insertPoint(vertices, allIdx, ctx)
    {
        let bezierPoint = [], bezierControl = []//, bezierFunction = []
        let i, m, p, lastControl, newControl, fourP
        let len = allIdx.length
        ctx.strokeStyle="#191970"

        if(allIdx[0] == allIdx[len-1])
        {
            m = Math.floor(len/2)
            p = len%2
            lastControl = middle(vertices[allIdx[0]], vertices[allIdx[1]])
            ctx.moveTo(lastControl[0],lastControl[1])
            let control0 = lastControl
            bezierPoint.push(lastControl)
            for(i = 0;i<m-1;i++)
            {
                newControl = middle(vertices[allIdx[2*i+2]], vertices[allIdx[2*i+3]])
                bezierPoint.push(newControl)
                fourP = [lastControl, vertices[allIdx[2*i+1]], vertices[allIdx[2*i+2]], newControl]
                bezierControl.push(fourP)
                lastControl = newControl
                ctx.bezierCurveTo(fourP[1][0], fourP[1][1], fourP[2][0], fourP[2][1], fourP[3][0], fourP[3][1])
            }
            if(p == 0)
            {
                fourP = [lastControl, vertices[allIdx[2*i+1]], control0, control0]
                bezierControl.push(fourP)
                ctx.bezierCurveTo(fourP[1][0], fourP[1][1], fourP[2][0], fourP[2][1], fourP[3][0], fourP[3][1])
            }
            else
            {
                fourP = [lastControl, vertices[allIdx[2*i+1]], vertices[allIdx[2*i+2]], control0]
                bezierControl.push(fourP)
                ctx.bezierCurveTo(fourP[1][0], fourP[1][1], fourP[2][0], fourP[2][1], fourP[3][0], fourP[3][1])
            }
        }
        else
        {
            m = Math.floor(len/2)-1
            p = len%2
            lastControl = vertices[allIdx[0]]
            ctx.moveTo(lastControl[0],lastControl[1])
            bezierPoint.push(lastControl)
            for(i = 0;i<m;i++)
            {
                newControl = middle(vertices[allIdx[2*i+2]], vertices[allIdx[2*i+3]])
                bezierPoint.push(newControl)
                fourP = [lastControl, vertices[allIdx[2*i+1]], vertices[allIdx[2*i+2]], newControl]
                bezierControl.push(fourP)
                lastControl = newControl
                ctx.bezierCurveTo(fourP[1][0], fourP[1][1], fourP[2][0], fourP[2][1], fourP[3][0], fourP[3][1])
            }
            if(p == 0)
            {
                ctx.lineTo(vertices[allIdx[len-1]][0],vertices[allIdx[len-1]][1])
            }
            if(p == 1)
            {
                fourP = [lastControl, vertices[allIdx[2*i+1]], vertices[allIdx[len-1]], vertices[allIdx[len-1]]]
                bezierControl.push(fourP)
                ctx.bezierCurveTo(fourP[1][0], fourP[1][1], fourP[2][0], fourP[2][1], fourP[3][0], fourP[3][1])
            }
        }
        return  {
                    //"bezierFunction":bezierFunction,
                    "bezierPoint":bezierPoint, 
                    "bezierControl":bezierControl
                }
    }

    bezierSmoth = 
    {
        smoth:function(allObj,targets,ctx)
        {
            let i,vertices,allIdx
            for(i = 0;i<targets.length;i++)
            {
                vertices = allObj[targets[i]].points
                allIdx = allObj[targets[i]].sequencePoints
                for(j = 0;j<allIdx.length;j++)
                {
                    result = insertPoint(vertices, allIdx[j], ctx)
                    //bezierControl = result.bezierControl
                    // drawLines(bezierControl,ctx)
                    // drawLinesOrigin(vertices, allIdx[j], ctx)
                }
            }
        ctx.stroke()
        }
    }

    if (typeof module !== "undefined")
        module.exports = bezierSmoth
})()