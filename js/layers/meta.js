let brokenSet = {
    11: {
        tooltip() {
            return this.type() + '<br><h1 style="font-weight: normal;font-size: 35px">{</h1>' + this.name() + '<h1 style="font-weight: normal;font-size: 35px">}</h1><br>' + this.effectDisplay()[0] + '<br><br>效果:<br>' + this.effectDisplay()[1] + '<br> ' + colorText('( ', 'gainsboro') + this.formula()[0] + colorText(' )', 'gainsboro') + ' <br> ' + (this.formula()[1] !== null ? (colorText('( ', 'gainsboro') + this.formula()[1] + colorText(' )', 'gainsboro')) : '')
        },
        effect() {
            return player.meta.potential[this.level()[0]][this.level()[1]].add(10).log(10).sub(1).sub(this.effectCorrective()[0]).mul(this.effectCorrective()[1])
        },

        level() { return [0, 0] },
        type() { return '[t]' },
        name() { return ' <sup class="metaSup first">log(t) → t<sup> </sup></sup>' },
        effectDisplay() {
            return ['t以对数的形式提升自身', '扩张[BSt]于[t]']
        },
        formulaEffect() {
            return player.value.add(10).log(n(10).sub(this.effect()))
        },
        formula() {
            return [
                'BSt = log<sub>' + colorText(format(n(10).sub(this.effect())), '#00ff00') + '</sub>(t + 10)',
                'BSt = ' + format(this.formulaEffect())
            ]
        },
        effectCorrective() {
            return [0, 0.076]
        },
    },
    12: {
        tooltip() {
            return this.type() + '<br><h1 style="font-weight: normal;font-size: 35px">{</h1>' + this.name() + '<h1 style="font-weight: normal;font-size: 35px">}</h1><br>' + this.effectDisplay()[0] + '<br><br>效果:<br>' + this.effectDisplay()[1] + '<br> ' + colorText('( ', 'gainsboro') + this.formula()[0] + colorText(' )', 'gainsboro') + ' <br> ' + (this.formula()[1] !== null ? (colorText('( ', 'gainsboro') + this.formula()[1] + colorText(' )', 'gainsboro')) : '')
        },
        effect() {
            return player.meta.potential[this.level()[0]][this.level()[1]].add(10).log(10).sub(1).sub(this.effectCorrective()[0]).mul(this.effectCorrective()[1])
        },

        level() { return [0, 1] },
        type() { return '[A-a]' },
        name() { return ' gain<sup class="metaSup">^<sup class="metaSup">^ </sup></sup>' },
        effectDisplay() {
            return ['指数提升a的获取指数', '扩张[BSa^]于[a]']
        },
        level() { return [0, 0] },
        formulaEffect() {
            return n(this.effect()).pow(0.2).add(1)
        },
        formula() {
            return [
                'BSa^ = ' + colorText(n(this.effect()), '#00ff00') + '<sup>0.2</sup> + 1',
                'BSa^ = ' + format(this.formulaEffect())
            ]
        },
        effectCorrective() {
            return [0, 0.01]
        },
    },
}

function brokenSetAble() {
    for (i in brokenSet) {
        let name = '<br><span class="metaName">' + brokenSet[i]['type']() + '</span><br><h1 style="font-weight: normal;font-size: 35px">{</h1><span class="metaTooltip">' + brokenSet[i]['name']() + '</span><h1 style="font-weight: normal;font-size: 35px">}</h1>'

        brokenSet[i].display = name
        brokenSet[i].metaClick = true

    }
    let set = brokenSet
    return set
}

function brokenWorldEffect() {
    return '<br>暂无效果生效'
}

addLayer("meta", {
    name: "meta",
    row: 99,
    symbol() { return options.ch ? '元' : 'Meta' },
    startData() {
        return {
            unlocked: true,
            points: n(0),
            level: n(0),
            levelTotal: n(0),
            levelCost: n(100),
            tower: n(0),
            towerTotal: n(0),
            towerCost: n(1),
            exp: n(0),
            mirror: n(0),
            mirrorGain: n(0),

            breakLevel: n(0),
            goals: n(0),

            potential: [[n(0), n(0)]],

            scores: n(0),
        }
    },
    tooltip() {
        return false
    },
    position: 4,
    color: "#fff",
    bars: {
        echeprogress: {
            direction: RIGHT,
            width: 400,
            height: 10,
            progress() { return player.meta.exp.div(player.meta.levelCost) },
            fillStyle: { "font-size": " 16px;" },
        },
        echeprogress2: {
            direction: RIGHT,
            width: 400,
            height: 10,
            progress() { return player.meta.exp.div(player.meta.levelCost) },
        },
    },
    update(diff) {
        player.meta.towerCost = n(10).pow(player.meta.tower.add(1)).mul(15).pow(1.3786).floor()

        let base = n(100)//.add(player.meta.level.sub(100).max(0)).add(player.meta.levelTotal.sub(200).mul(50).max(0))
        player.meta.levelCost = base//.min(1000).add(base.sub(1000).max(0).root(2))
        //if(player.meta.levelTotal.gte(950)){player.meta.levelCost = base}
        //if(player.meta.levelTotal.gte(975)){player.meta.levelCost = base.pow(1.3)}

        if (player.meta.level.gte(player.meta.towerCost)) {
            player.meta.level = player.meta.level.sub(player.meta.towerCost)
            player.meta.tower = player.meta.tower.add(1)
            player.meta.towerTotal = player.meta.towerTotal.add(1)
        }
        if (player.meta.exp.gte(player.meta.levelCost)) {
            player.meta.exp = player.meta.exp.sub(player.meta.levelCost)
            player.meta.level = player.meta.level.add(1)
            player.meta.levelTotal = player.meta.levelTotal.add(1)
        }

        if (player.meta.tower.gte(1)) {
            player.meta.mirrorGain = n(10).pow(player.meta.tower.mul(2))
        } else {
            player.meta.mirrorGain = n(0)
        }
        player.meta.mirror = player.meta.mirror.add(player.meta.mirrorGain.mul(diff))

        if (player.meta.buyables[41].gte(600)) {
            for (let col = 1; col <= 4; col++) {
                let a = 10 + col
                if (tmp.meta.buyables[a].canAfford) {
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if (player.meta.buyables[41].gte(900)) {
            for (let col = 1; col <= 3; col++) {
                let a = 20 + col
                if (tmp.meta.buyables[a].canAfford) {
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if (player.meta.buyables[41].gte(1200)) {
            for (let col = 1; col <= 2; col++) {
                let a = 30 + col
                if (tmp.meta.buyables[a].canAfford) {
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if (player.meta.buyables[41].gte(1600)) {
            for (let col = 1; col <= 1; col++) {
                let a = 40 + col
                if (tmp.meta.buyables[a].canAfford) {
                    layers.meta.buyables[a].buy()
                }
            }
        }
    },
    buyables: {
        rows: 1,
        cols: 1,
        11: {
            title() {
                return '基础构建' + (player.meta.levelTotal.gte(1) ? 'I<br>' : '<br>');
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' n<sub>s</sub><br>(+' + format(n(this.gain())) + '%)'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(10)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(100000).pow(n(2).pow(x.div(1000)).add(x.root(1.08).mul(0.004))).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.superValue.gte(this.cost()) },
            style() { return { 'width': "170px", "min-width": "100px", 'height': "170px", } },
            unlocks() { return n(0) },
        },
        12: {
            title() {
                return '基础构建II<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' a<br>(+' + format(n(this.gain())) + '%)'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(20).add(x).root(2).mul(2)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n('1e3000').pow(x.pow(2.5).add(n(1.2).pow(x)).root(10)).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.a.value.gte(this.cost()) },
            style() { return { 'width': "170px", "min-width": "100px", 'height': "170px", } },
            unlocks() { return n(1) },
            unlocked() { return player.meta.levelTotal.gte(1) },
        },
        13: {
            title() {
                return '基础构建III<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' α<br>(+' + format(n(this.gain())) + '%)'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return x.mul(5).add(25).sqrt()
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                let base = x.mul(5).add(100).pow(1.45).mul(n(1.02).pow(x.root(1.33)))
                return base.pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.a2.points.gte(this.cost()) },
            style() { return { 'width': "170px", "min-width": "100px", 'height': "170px", } },
            unlocks() { return n(2) },
            unlocked() { return player.meta.levelTotal.gte(2) },
        },
        14: {
            title() {
                return '基础构建IV<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' power<br>(+' + format(n(this.gain())) + '%)'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(2.5).add(x.add(1).log(2).add(1).pow(1.6))
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(x).add(100).pow(x.add(50).log(2)).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.b.powerValue.gte(this.cost()) },
            style() { return { 'width': "170px", "min-width": "100px", 'height': "170px", } },
            unlocks() { return n(25) },
            unlocked() { return player.meta.levelTotal.gte(25) },
        },
        21: {
            title() {
                return '进阶构建I<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' 基础构建数量<br>(+' + format(n(this.gain())) + '%)<br><br>(基础构建数量: ' + formatWhole(this.count()) + ')<br><br>构建效果:<br> ' + this.effect()
            },
            count() {
                return n(player[this.layer].buyables[11]).add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14])
            },
            effect() {
                if (player[this.layer].buyables[this.id].gte(15)) {
                    return '自动执行轮盘(每秒20次)'
                }
                return '当前构建无效果,将在 ' + formatWhole(n(15).sub(player[this.layer].buyables[this.id])) + ' 进阶构建I后产生'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(10).add(x.mul(10))
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(x).pow(2).add(160).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return n(this.count()).gte(this.cost()) },
            style() { return { 'width': "226px", "min-width": "100px", 'height': "226px", } },
            unlocks() { return n(50) },
            unlocked() { return player.meta.levelTotal.gte(50) },
        },
        22: {
            title() {
                return '进阶构建II<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' J<br>(+' + format(n(this.gain())) + '%)<br><br>构建效果:<br> ' + this.effect()
            },
            effect() {
                if (player[this.layer].buyables[this.id].gte(6)) {
                    return '轮盘执行时可以同时获得电池与非电池的数值'
                }
                return '当前构建无效果,将在 ' + formatWhole(n(6).sub(player[this.layer].buyables[this.id])) + ' 进阶构建II后产生'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(x).add(1).mul(10).log(10).add(2).pow(2).max(1).mul(10)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n('1e500000').pow(x.add(2).pow(2).log(4)).pow(n(1.5).add(x.div(100).pow(1.05).add(x.div(1000).pow(1.4)))).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.co.points.gte(this.cost()) },
            style() { return { 'width': "226px", "min-width": "100px", 'height': "226px", } },
            unlocks() { return n(128) },
            unlocked() { return player.meta.levelTotal.gte(128) },
        },
        23: {
            title() {
                return '进阶构建III<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' b<br>(+' + format(n(this.gain())) + '%)<br><br>构建效果:<br> ' + this.effect()
            },
            effect() {
                if (player[this.layer].buyables[this.id].gte(32)) {
                    return '自动购买B能量且无消耗'
                }
                return '当前构建无效果,将在 ' + formatWhole(n(32).sub(player[this.layer].buyables[this.id])) + ' 进阶构建II后产生'
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(x).add(20).pow(1.75)//.min(6000)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(x).add(25).root(2).factorial().add(10000).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return player.b.value.gte(this.cost()) },
            style() { return { 'width': "226px", "min-width": "100px", 'height': "226px", } },
            unlocks() { return n(169) },
            unlocked() { return player.meta.levelTotal.gte(169) },
        },
        31: {
            title() {
                return '至高构建I<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' 基础构建I<sup>进阶构建I</sup> 数量<br>(+' + format(n(this.gain())) + '%)<br><br>(基础构建I<sup>进阶构建I</sup> 数量: ' + formatWhole(this.count()) + ')<br><br>构建效果:<br> ' + this.effect()
            },
            count() {
                return player.meta.buyables[11].pow(player.meta.buyables[21])
            },
            effect() {
                if (player[this.layer].buyables[this.id].gte(175)) {
                    return '根据 基础构建I<sup>进阶构建I</sup> 数量 提升n<sub>s</sub>乘数<br><br>mul<sub>s</sub>(计数) = lg<sup>3</sup>( 计数 + 10 )/1e4<br>mul<sub>s</sub>(' + format(this.count()) + ') = ' + format(n(this.effectCount()))
                }
                return '当前构建无效果,将在 ' + formatWhole(n(175).sub(player[this.layer].buyables[this.id])) + ' 至高构建I后产生'
            },
            effectCount() {
                return n(this.count()).add(10).log(10).pow(3).div(1e4)
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(x).add(10).pow(10).max(1).log(2).max(1)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(x).add(10).pow(x.sqrt().div(2).add(16)).add(x.sqrt().mul(3.6).factorial()).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return n(this.count()).gte(this.cost()) },
            style() { return { 'width': "338px", "min-width": "100px", 'height': "338px", } },
            unlocks() { return n(369) },
            unlocked() { return player.meta.levelTotal.gte(369) },
        },
        32: {
            title() {
                return '至高构建II<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' 进阶构建数量<br>(+' + format(n(this.gain())) + '%)<br><br>(进阶构建数量数量: ' + formatWhole(this.count()) + ')<br><br>构建效果:<br> ' + this.effect()
            },
            count() {
                return n(player[this.layer].buyables[21]).add(player[this.layer].buyables[22]).add(player[this.layer].buyables[23])
            },
            effect() {
                if (player[this.layer].buyables[this.id].gte(10)) {
                    return '每个至高构建II降低b获取指数增长<br><br>(/' + format(player[this.layer].buyables[this.id].mul(0.1).add(1)) + ')'
                }
                return '当前构建无效果,将在 ' + formatWhole(n(10).sub(player[this.layer].buyables[this.id])) + ' 至高构建II后产生'
            },
            effectCount() {
                return n(this.count()).add(10).log(10)
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(200).add(x.mul(50))
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return x.div(2).pow(2).add(x.mul(5)).add(50).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford() { return n(this.count()).gte(this.cost()) },
            style() { return { 'width': "338px", "min-width": "100px", 'height': "338px", } },
            unlocks() { return n(500) },
            unlocked() { return player.meta.levelTotal.gte(500) },
        },
        41: {
            title() {
                return '最终构建I<br>';
            },
            display() {
                return '下一个: ' + format(this.cost()) + ' 构建能量<br>(+' + format(n(this.gain())) + '%)<br><br>(构建能量(基于先前所有构建): ' + formatWhole(this.count()) + ')<br><br>构建效果:<br><br> ' + this.effect()
            },
            count() {
                return n(n(player[this.layer].buyables[11])).add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).mul(player[this.layer].buyables[21]).mul(player[this.layer].buyables[22]).mul(player[this.layer].buyables[23]).pow(player[this.layer].buyables[31]).pow(player[this.layer].buyables[32])
            },
            effect() {
                let c = [150, 250, 400, 600, 900, 1200, 1600, 1900, 500000]
                let a = ''
                if (player[this.layer].buyables[this.id].gte(c[0])) {
                    a += '1.CoP会根据自身提升CoP指数<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[0]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[1])) {
                    a += '2.根据最终构建I的数量指数降低先前所有构建需求<br>(^' + format(this.effectCount()[0], 5) + ')<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[1]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                //新加的
                if (player[this.layer].buyables[this.id].gte(c[2])) {
                    a += '3.所有构建的乘积的平方根除以2e11后倍增阿尔法获取速度和转盘速度.<br>(x' + format(this.effectCount()[1], 3) + ')<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[2]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[3])) {
                    a += '4.自动购买基础构建<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[3]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[4])) {
                    a += '5.自动购买进阶构建<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[4]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[5])) {
                    a += '6.自动购买至高构建<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[5]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[6])) {
                    a += '7.自动购买最终构建<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[6]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[7])) {
                    a += '8.解锁 元破碎 页面<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[7]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }
                if (player[this.layer].buyables[this.id].gte(c[8])) {
                    a += '9.解锁 元监视 页面<br><br>'
                } else {
                    return a + '下一个效果将在 ' + formatWhole(n(c[8]).sub(player[this.layer].buyables[this.id])) + ' 最终构建I'
                }/* 
                if(player[this.layer].buyables[this.id].gte(c[8])){
                    a += '9.占位符<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[8]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                } */
                return a
            },
            effectCount() {
                let product = n(1)
                let constructs = [11, 12, 13, 14, 21, 22, 23, 31, 32, 41]
                for (i in constructs) {
                    product = product.mul(player.meta.buyables[constructs[i]])
                }
                return [
                    player[this.layer].buyables[this.id].gte(250) ? n(1).div(player[this.layer].buyables[this.id].root(2).sub(5).max(10).log10().pow(0.1)) : n(1),
                    product.pow(0.5).div(2e11).max(1)
                ]
            },
            gain(x = player[this.layer].buyables[this.id]) {
                return n(1)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x) {
                return n(10).pow(x.add(10)).pow(x.add(10))
            },
            canAfford() { return n(this.count()).gte(this.cost()) },
            style() { return { 'width': "672px", "min-width": "100px", 'height': "672px", } },
            unlocks() { return n(876) },
            unlocked() { return player.meta.levelTotal.gte(876) },
        },
    },
    challenges: {
        11: {
            name: "破碎集合",
            challengeDescription() {
            },
            unlocked() { return player.meta.tower.gte(1) },
            nextLayer() { return n(5) },
            canComplete: function () { return false },
            style() { return 'border-radius:5px;width: 650px;height: 650px;background: #fff;color: rgb(54, 54, 54)' },
        },
    },
    clickables: brokenSetAble(),
    microtabs: {
        "主要": {
            "回切任务": {
                content: [
                    ["blank", "25px"],
                    ["display-text", function () { return '<span style="color:#aaa">————长按以构建————</span>' }],
                    ["blank", "25px"],
                    ['row', [["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14]]],
                    ['row', [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
                    ['row', [["buyable", 31], ["buyable", 32]]],
                    ['row', [["buyable", 41]]],
                    ["blank", "100px"],
                    ["display-text", function () { return '回切进度' }],
                    ["display-text", function () { return '(' + format(player.meta.exp) + '%)' + (player.meta.levelCost.gt(100) ? ' -> (' + format(player.meta.levelCost) + '%)' : '') }],
                    ["bar", "echeprogress2"],
                    ["display-text", function () {
                        let a = n(1)
                        let c = [11, 12, 13, 14, 21, 22, 23, 31, 32, 41]
                        for (let i = 0; i <= 99; i++) {
                            if (c[i] !== undefined) {
                                if (player.meta.levelTotal.gte(tmp.meta.buyables[c[i]].unlocks)) {
                                    if (c[i + 1] == undefined) {
                                        return '<br><span id="points" style="color:#aaa">没有更多任务了</span><br>下一回切指数塔: <h2 id="points">' + format(player.meta.level, 0) + '</h2> / <h2 id="points" style="color:#aaa">' + format(player.meta.towerCost, 0) + '</h2>'
                                    } else {
                                        a = tmp.meta.buyables[c[i + 1]].unlocks
                                    }
                                } else {
                                    break
                                }
                            } else {
                                return '<br><span id="points" style="color:#aaa">没有更多任务了</span>'
                            }
                        }
                        return '<br>下一回切任务: <h2 id="points">' + format(player.meta.level, 0) + '</h2> / <h2 id="points" style="color:#aaa">' + format(a, 0) + '</h2>'
                    }],
                    ["blank", "100px"],
                ]
            },
            "元破碎": {
                unlocked() { return player.meta.buyables[41].gte(7500) },
                content: [
                    ["blank", "7px"],
                    ["display-text", function () { return player.meta.towerTotal.gte(1) ? '' : '你需要获得回切指数塔以推进下一步内容' }],
                    ["blank", "5px"],
                    ["microtabs", "破碎"],
                ]
            },
            "元监视": {
                unlocked() { return player.meta.buyables[41].gte(375000) },
                buttonStyle() { return { 'border-color': '#aaa' } },
                content: [
                    ["blank", "7px"],
                    ["display-text", function () { return '<h3>Scores(湮灭能量) = 湮灭能量<h3>' }],
                    ["display-text", function () { return 'Scores(' + format(player.meta.scores) + ') = ' + format(player.meta.scores) }],
                    ["blank", "5px"],
                    ["microtabs", "监视器"],
                ]
            },
        },
        "破碎": {
            "破碎集合": {
                buttonStyle() { return { 'border-color': '#aaa' } },
                unlocked() { return player.meta.tower.gte(1) },
                content: [
                    ["blank", "30px"],
                    ["display-text", function () { return '<div><h2>破碎集合</h2></div>' }],
                    ["display-text", function () { return '进入破碎世界<br><br>重置:<br>重置先前的所有与凌片<br><br>扩展:<br>完成目标后你可以进入下一层并选择增加一个集合公式的潜力值并解锁<br>潜力值获取根据完成的目标数量增加<br>在扩展中获得的集合公式效果增加百倍,退出时失效' }],
                    ["blank", "30px"],
                    ["microtabs", "破碎集合目标"],
                ]
            },
            "集合公式": {
                buttonStyle() { return { 'border-color': '#aaa' } },
                unlocked() { return player.meta.tower.gte(1) },
                content: [
                    ["blank", "100px"],
                    'clickables',
                    ["blank", "100px"],
                ]
            },
            "破碎凌片": {
                buttonStyle() { return { 'border-color': '#aaa' } },
                unlocked() { return player.meta.tower.gte(1) },
                content: [
                    ["blank", "100px"],
                    'clickables',
                    ["blank", "100px"],
                ]
            },
        },
        "监视器": {
            "集合世界": {
                buttonStyle() { return { 'border-color': '#aaa' } },
                content: [
                    ["display-text", function () {
                        let res = ['Avolve', '阿尔法能量', 'RA', 'timewall', 'γ', 'gamma', 'B能量', 'RC']
                        let resEff = [['add', player.a.valueA], ['add', player.a2.points], ['add', player.ro.valueA], ['mul', tmp.a2.timespeedBoost], ['mul', player.a2.gamma], ['mul', player.a2.valueGamma], ['mul', player.b.points], ['pow', player.ro.valueC]]

                        let effNumber = n(0)

                        let first = '<table border="2" style="border-collapse: collapse; padding:7px; border-color:#fff;"><tr><td style="padding:7px; width:200px">物质</td><td style="padding:5px; width:200px">效果</td><td style="padding:7px; width:200px">崩坠能量</td></tr>'
                        for (i in res) {
                            let com = '+'
                            let number = resEff[i][1]
                            if (resEff[i][0] == 'add') {
                                com = '+'
                                effNumber = effNumber.add(number)
                            } else if (resEff[i][0] == 'mul') {
                                com = '×'
                                effNumber = effNumber.mul(n(number).max(1))
                            } else if (resEff[i][0] == 'pow') {
                                com = '^'
                                effNumber = effNumber.pow(n(number).max(1))
                            }

                            let a = '<tr><td style="padding:7px; width:200px">' + res[i] + '</td><td style="padding:7px; width:200px">' + com + format(number) + '</td><td style="padding:7px; width:200px">' + format(effNumber) + '</td></tr>'
                            first += a
                        }

                        player.meta.scores = n(effNumber)

                        let fin = first + '</table>'
                        return fin
                    }],
                    ["blank", "100px"],
                ]
            },
        },
        '破碎集合目标': {
            " 目 标 ": {
                unlocked() { return player.meta.tower.gte(1) },
                content: [
                    ["blank", "30px"],
                    ["display-text", function () { return '目标' }],
                    ["blank", "100px"],
                ]
            },
        },
    },
    displayFormula() {
        let f = "0";

        return [f];
    },
    calculateValue() {
        let val = n(0);
        return val;
    },
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        ["blank", "25px"],
        ["blank", "25px"],
        ["display-text", function () { return '回切进度' }],
        ["display-text", function () { return '(' + format(player.meta.exp) + '%)' + (player.meta.levelCost.gt(100) ? ' -> (' + format(player.meta.levelCost) + '%)' : '') }],
        ["bar", "echeprogress"],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '你已经到达了 <h2 id="points">' + format(player.meta.level, 0) + '</h2> 回切阶层' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '<i style="color:#aaa"> 你需要 <h2 id="points" style="color:#aaa">' + format(player.meta.towerCost, 0) + '</h2> 回切阶层晋升回切指数塔 </i>' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '你已经到达了 <h2 id="points">' + format(player.meta.tower, 0) + '</h2> 回切指数塔' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '<i style="color:#aaa">你的回切指数塔为你生产 <h2 id="points" style="color:#aaa">' + format(player.meta.mirrorGain, 0) + '</h2> 凌片每秒</i>' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '你拥有 <h2 id="points">' + format(player.meta.mirror, 0) + '</h2> 凌片' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '<i style="color:#aaa">ShArD(凌片) = ' + tmp[this.layer].displayFormula[0] + '</i>' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '<big>ShArD(' + format(player.meta.mirror, 0) + ') = ' + tmp[this.layer].displayFormula[0] + '</big>' }],
        ["display-text", function () { return '↓ ↓ ↓' }],
        ["display-text", function () { return '<i style="color:#aaa">目前ShArD未在任何公式中出现</i>' }],
        ["blank", "25px"],
        ["blank", "25px"],
        ["microtabs", "主要"],
    ],
    layerShown() { return tmp.goals.unlocks >= 8 },
    componentStyles: {
        achievement: {
            "border-radius": "5%",
        },
        buyable: {
            "border-radius": "5%",
            "color": "#000",
        },
    },
})
