let sequenceLine
(function()
{
    sequenceLine =
    {
        sequence:function(allObj,targets)
        {
            let object, p, o, twoP, head, tail, objD
            let allEdges, edges = []
            let allP, points = []
            for(let i = 0;(i<targets.length);i++)
            {
                allP = []
                allEdges = []
                object = allObj[targets[i]]
                p = object.points
                o = object.obj
                objD = JSON.parse(JSON.stringify(o))
                for(let j = 0;(j<p.length) && (JSON.stringify(objD)!=="{}");j++)
                {
                    twoP = objD[j]
                    delete objD[j]

                    if(twoP == undefined) continue

                    else if(twoP.length == 2)
                    {
                        head = twoP[0]
                        tail = twoP[1]
                        edges = [[head, j], [j, tail]]
                        points = [head, j, tail]
                        delete objD[j]
                        while(1)
                        {
                            twoP = objD[tail]
                            delete objD[tail]
                            if(twoP == undefined)
                            {
                                break
                            }
                            else if(twoP.length == 2)
                            {
                                if((objD[twoP[0]] == undefined) && (objD[twoP[1]] == undefined))
                                {
                                    break
                                }
                                if(objD[twoP[0]] == undefined)
                                {
                                    edges.push([tail,twoP[1]])
                                    points.push(twoP[1])
                                    tail = twoP[1]
                                    continue
                                }
                                if(objD[twoP[1]] == undefined)
                                {
                                    edges.push([tail,twoP[0]])
                                    points.push(twoP[0])
                                    tail = twoP[0]
                                    continue
                                }
                            }
                            else        //twoP.length == 1
                            {
                                if(head == undefined) break
                                else
                                {
                                    tail = head
                                    head = undefined
                                    edges.reverse()
                                    points.reverse()
                                    for(m = 0;m<edges.length;m++)
                                    {
                                        edges[m].reverse()
                                    }
                                    continue
                                }
                            }
                        }
                    }

                    else
                    {
                        if(objD[twoP[0]].length == 1)
                        {
                            edges.push([point,twoP[0]])
                            points.push([twoP[0]])
                            delete objD[point]
                            delete objD[twoP[0]]
                        }
                        continue
                    }
                    allEdges.push(edges)
                    allP.push(points)
                }
                allObj[targets[i]]["sequenceEdges"] = allEdges
                allObj[targets[i]]["sequencePoints"] = allP
            }
            return allObj
        }
    }
    if (typeof module !== "undefined")
        module.exports = sequenceLine
})()