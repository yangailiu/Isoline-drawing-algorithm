let twiceSmoth
(function()
{
    //求二次函数表达式（用已知三点坐标表示）
    function quadratic(threeP, ctx, splitRate, choice)
    {
        let abcX = [],abcY = []
        let xa = 2*threeP[0][0] - 4*threeP[1][0]+2*threeP[2][0]
        let xb = -3*threeP[0][0] + 4*threeP[1][0] - threeP[2][0]
        let xc = threeP[0][0]
        abcX = [xa, xb, xc]
        let ya = 2*threeP[0][1] - 4*threeP[1][1]+2*threeP[2][1]
        let yb = -3*threeP[0][1] + 4*threeP[1][1] - threeP[2][1]
        let yc = threeP[0][1]
        abcY = [ya, yb, yc]

        //draw
        let i, dt = 0.5/splitRate

        if(choice == "head")
        {
            ctx.moveTo(threeP[0][0],threeP[0][1])
            for(i = 1;i<splitRate-1;i++)
            {
                t = i*dt
                ctx.lineTo(xa*t*t+xb*t+xc, ya*t*t+yb*t+yc)
            }
            ctx.lineTo(threeP[1][0],threeP[1][1])
            ctx.stroke()
        }

        if(choice == "tail")
        {
            ctx.moveTo(threeP[1][0],threeP[1][1])
            for(i = 1;i<splitRate-1;i++)
            {
                t = 0.5+i*dt
                ctx.lineTo(xa*t*t+xb*t+xc, ya*t*t+yb*t+yc)
            }
            ctx.lineTo(threeP[2][0],threeP[2][1])
            ctx.stroke()
        }

        if(choice == "threeP")
        {
            dt = 1/splitRate
            for(i = 1;i<splitRate-1;i++)
            {
                t = i*dt
                ctx.lineTo(xa*t*t+xb*t+xc, ya*t*t+yb*t+yc)
            }
            ctx.lineTo(threeP[2][0],threeP[2][1])
            ctx.stroke()
        }
        return [abcX,abcY]
    }

    //求三次函数表达式（用已知四点坐标表示）
    function cubic(fourP, ctx, splitRate)
    {
        let abcdX = [],abcdY = []
        let xa = -4*fourP[0][0] + 12*fourP[1][0] - 12*fourP[2][0] + 4*fourP[3][0]
        let xb = 4*fourP[0][0] - 10*fourP[1][0] + 8*fourP[2][0] - 2*fourP[3][0]
        let xc = -fourP[0][0] + fourP[2][0]
        let xd = fourP[1][0]
        abcdX = [xa,xb,xc,xd]
        let ya = -4*fourP[0][1] + 12*fourP[1][1] - 12*fourP[2][1] + 4*fourP[3][1]
        let yb = 4*fourP[0][1] - 10*fourP[1][1] + 8*fourP[2][1] - 2*fourP[3][1]
        let yc = -fourP[0][1] + fourP[2][1]
        let yd = fourP[1][1]
        abcdY = [ya,yb,yc,yd]

        //draw
        ctx.moveTo(fourP[1][0],fourP[1][1])
        let i, dt = 0.5/splitRate
        for(i = 1;i<splitRate-1;i++)
        {
            t = i*dt
            ctx.lineTo(xa*t*t*t+xb*t*t+xc*t+xd, ya*t*t*t+yb*t*t+yc*t+yd)
        }
        ctx.lineTo(fourP[2][0],fourP[2][1])
        ctx.stroke()
        return [abcdX,abcdY]
    }

    function drawLines(vertices, allIdx, ctx, splitRate)
    {
        let i, len = allIdx.length, threeP, fourP, result = []
        
        if(len <= 1)
        {
            console.log("warning!!!")
            return []
        }
        //y = ax+b
        if(len == 2)
        {
            let point1 = vertices[allIdx[0]], point2 = vertices[allIdx[1]]
            ctx.moveTo(point1)
            ctx.lineTo(point2)
            ctx.stroke()
            let a = (point2[1]-point1[1])/(point2[0]-point1[0])
            let b = point2[1]-a*point2[0] 
            return [[a],[b]]
        }
        if(len == 3 && allIdx[0] != allIdx[len-1])
        {
            threeP = [vertices[allIdx[0]],vertices[allIdx[1]],vertices[allIdx[2]]]
            result.push(quadratic(threeP, ctx, splitRate))
            return result
        }

        //常规情况
        if(allIdx[0] != allIdx[len-1])      //非闭合区域
        {
            //非闭合处理方式一：将首尾两段折线变为二次函数，中间的变为三次函数
            threeP = [vertices[allIdx[0]], vertices[allIdx[1]], vertices[allIdx[2]]]
            result.push(quadratic(threeP, ctx, splitRate))
            for(i = 0;i<len-3;i++)
            {
                fourP = [vertices[allIdx[i]], vertices[allIdx[i+1]], vertices[allIdx[i+2]], vertices[allIdx[i+3]]]
                result.push(cubic(fourP, ctx, splitRate))
            }
            threeP = [vertices[allIdx[len-3]], vertices[allIdx[len-2]], vertices[allIdx[len-1]]]
            result.push(quadratic(threeP, ctx, splitRate))
            //非闭合处理方式二：在首段之前复制一个起点，在尾段复制一个终点
            //再从头到尾做三次函数（猜测最终结果应该与方式一相同，只是表达方式不同）
        }
        else                                //闭合区域
        {
            fourP = [vertices[allIdx[len-2]], vertices[allIdx[0]], vertices[allIdx[1]], vertices[allIdx[2]]]
            result.push(cubic(fourP, ctx, splitRate))
            for(i = 0;i<len-3;i++)
            {
                fourP = [vertices[allIdx[i]], vertices[allIdx[i+1]], vertices[allIdx[i+2]], vertices[allIdx[i+3]]]
                result.push(cubic(fourP, ctx, splitRate))
            }
            fourP = [vertices[allIdx[len-3]], vertices[allIdx[len-2]], vertices[allIdx[len-1]], vertices[allIdx[1]]]
            result.push(cubic(fourP, ctx, splitRate))
        }
        return result
    }

    twiceSmoth = 
    {
        smoth:function(targets, allObj, ctx, splitRate)
        {
            ctx.strokeStyle = "#FF0000"
            let i,vertices,allIdx
            for(i = 0;i<targets.length;i++)
            {
                vertices = allObj[targets[i]].points
                allIdx = allObj[targets[i]].sequencePoints
                for(j = 0;j<allIdx.length;j++)
                {
                    drawLines(vertices, allIdx[j], ctx, splitRate)
                }
            }
        }
    }
}())