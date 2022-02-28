let Smoth
(function()
{
    function sylSmoth(allIdx,vertices,choice,Matrix)
    {

        let n = allIdx.length-1
        let vertice, i
        let x = [vertices[allIdx[0]][0]], y = [vertices[allIdx[0]][1]]
        let deltaX = [], deltaY = [], deltaK = []
        for(i = 1;i<n+1;i++)
        {
            vertice = vertices[allIdx[i]]
            x.push(vertice[0])
            y.push(vertice[1])
            deltaX.push(Math.floor((vertice[0]*1000-vertices[allIdx[i-1]][0]*1000))/1000)
            deltaY.push(Math.floor((vertice[1]*1000-vertices[allIdx[i-1]][1]*1000))/1000)
            deltaK.push(Number((deltaY[i-1]/deltaX[i-1]).toFixed(3)))
        }

        let matrixA = Matrix.Zero(n+1,n+1).elements
        let matrixB = Matrix.Zero(n+1,1).elements

        if(choice == 1)
        {
            matrixA[0][0] = 1
            matrixA[n][n] = 1
        }
        // if(choice == 2)
        // {
        //     matrixA[0][0] = 2*deltaX[0]
        //     matrixA[0][1] = deltaX[0]
        //     matrixA[n][n-1] = deltaX[n-1]
        //     matrixA[n][n] = 2*deltaX[n-1]
        // }
        if(choice == 3)
        {
            matrixA[0][0] = -deltaX[1]
            matrixA[0][1] = deltaX[0]+deltaX[1]
            matrixA[0][2] = -deltaX[0]
            matrixA[n][n-2] = -deltaX[n-1]
            matrixA[n][n-1] = deltaX[n-2]+deltaX[n-1]
            matrixA[n][n] = -deltaX[n-2]
        }
        // if(choice == 4)
        // {
        //     matrixA[0][0] = 1
        //     matrixA[0][n] = -1
        //     matrixA[n][0] = deltaX[0]
        //     matrixA[n][1] = deltaX[0]
        //     matrixA[n][n-1] = -deltaX[n-1]
        //     matrixA[n][n] = -deltaX[n-1]
        // }

        for(i = 1; i<n; i++)
        {
            matrixA[i][i-1] = deltaX[i-1]
            matrixA[i][i] = 2*(deltaX[i]+deltaX[i-1])
            matrixA[i][i+1] = deltaX[i]
            matrixB[i][0] = Number((deltaK[i] - deltaK[i-1]).toFixed(3))
        }
        //console.log(matrixA,matrixB)
        let MA = $M(matrixA),MB = $M(matrixB)
        let minusMA = MA.inv()
        let solution = minusMA.multiply(MB)
        let m = solution.elements
        
        //console.log(x,y,deltaX,deltaY)

        let a = [],b = [],c = [],d = []
        for(i = 0;i<n;i++)
        {
            a.push(y[i])
            // b.push(deltaK[i]-deltaX[i]*m[i]/2-deltaX[i]*(m[i+1]-m[i])/6)
            // c.push(m[i]/2)
            // d.push(((m[i+1]-m[i])/deltaX[i]/6))
            b.push(deltaK[i]+deltaX[i]*m[i]/2+deltaX[i]*(m[i+1]-m[i])/6)
            c.push(-m[i]/2)
            d.push(-((m[i+1]-m[i])/deltaX[i]/6))
        }
        //console.log(a,b,c,d)
        return {a:a, b:b, c:c, d:d, x:x, y:y, deltaX:deltaX, deltaY:deltaY, deltaK:deltaK}
        // // test
        // let delx = -10
        // let dely1 = deltaK[0] * delx
        // let dely2 = b[0]*delx + c[0]*delx*delx + d[0]*delx*delx*delx
        // console.log(dely1,dely2)
    }

    function drawSmothLine(ctx, abcd, len, n)
    {
        let i,j,newX,newY
        for(i = 0;i<len-1;i++)
        {
            newX = abcd.x[i]
            newY = abcd.y[i]
            ctx.strokeStyle="#FF0000"
            ctx.beginPath()
            ctx.moveTo(abcd.x[i],abcd.y[i])
            dx = abcd.deltaX[i]/n
            for(j = 1;j<n;j++)
            {
                newX = abcd.x[i] + j*dx
                newY = abcd.y[i] + abcd.b[i]*j*dx + abcd.c[i]*j*dx*j*dx + abcd.d[i]*j*dx*j*dx*j*dx
                ctx.lineTo(newX,newY)
            }
            ctx.lineTo(abcd.x[i+1],abcd.y[i+1])
            ctx.stroke()
        }
    }

    // function find_two_edges(allIdx,vertices)
    // {
    //     let minX = 10000, minIdx = 0, maxX = 0, maxIdx = 0,x
    //     for(i = 0;i<allIdx.length;i++)
    //     {
    //         x = vertices[allIdx[i]][0]
    //         if(x<minX)
    //         {
    //             minX = x
    //             minIdx = i
    //         }
    //         if(x>maxX)
    //         {
    //             maxX = x
    //             maxIdx = i
    //         }
    //     }
    //     return [allIdx.slice(minIdx,maxIdx+1), allIdx.slice(maxIdx,allIdx.length-1).concat(allIdx.slice(0,minIdx+1))]
    // }
    

    Smoth = 
    {
        smoth:function(targets, allObj, choice, Matrix, ctx, n)
        {
            let allIdx, i, j, vertices, len, l
            for(i = 0;i<targets.length;i++)
            {
                vertices = allObj[targets[i]].points
                allIdx = allObj[targets[i]].sequencePoints
                for(j = 0;j<allIdx.length;j++)
                {
                    len = allIdx[j].length

                    abcd = sylSmoth(allIdx[j],vertices,choice,Matrix)
                    //将每一条线段分成n份来画
                    drawSmothLine(ctx, abcd, len, n)

                    ////将闭合区域分为两块,暂不可行。。
                    // twoEgdes = find_two_edges(allIdx[j],vertices)
                    // //console.log(twoEgdes)
                    // for(l = 0;l<twoEgdes.length;l++)
                    // {
                    //     length = twoEgdes[l].length
                    //     abcd = sylSmoth(twoEgdes[l],vertices,choice,Matrix)
                    //     //将每一条线段分成n份来画
                    //     drawSmothLine(ctx, abcd, length, n)
                    // }
                    // drawSmothLine(ctx, abcd, len, n)
                }
            }
        }
    }
    if (typeof module !== "undefined")
        module.exports = Smoth
})()