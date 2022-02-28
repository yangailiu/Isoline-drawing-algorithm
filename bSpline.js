let bSpline
(function()
{
    

    bSpline = 
    {
        smoth:function(allArr,targets,allObj,ctx)
        {
            let i,obj,vertices,allIdx
            for(i = 0;i<targets.length;i++)
            {
                obj = allArr[targets[i]]
                vertices = allObj[targets[i]].points
                allIdx = obj.points
                for(j = 0;j<allIdx.length;j++)
                {
                    drawLines(vertices, allIdx[j], ctx)
                }
            }
        }
    }
}())