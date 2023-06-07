let brokenSet = {
    11:{
        type(){return '[t]'},
        name(){return 'log(t) → t'},
        tooltip(){return '[t]<br>{log(t) → t}<br>t以对数的形式提升自身<br><br>效果:<br>扩张[BSt]于[t]<br>(BSt = log<sub>'+colorText(format(n(10).sub(this.effect()),2),'#00ff00')+'</sub>)'},
        layer(){return n(1)},
        effect(){
            if(player.meta.potential11!==undefined && player.meta.potential11!==null){
                return player.meta.potential11.add(1).log(10).sub(this.effectCorrective[0]()).mul(this.effectCorrective[1]())
            }
            return n(1)
        },
        effectCorrective(){
            return [1,0.076]
        },
    },
    12:{
        type(){return '[A-a]'},
        name(){return 'gain<sup>^<sup>^</sup></sup>'},
        tooltip(){return ''},
        layer(){return n(1)},

    },
}

addLayer("meta", {
    name: "meta",
    row: 99,
    symbol() { return options.ch ? '元' : 'Meta' },
    startData() { return {
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
        breakTotal: n(0),
        goals: n(0),

        scores: n(0),
        
        brokenSetUnlockOrder:[]//你 自 己 存 解 锁 顺 序
    }},
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
            progress() {return player.meta.exp.div(player.meta.levelCost)},
        },
        echeprogress2: {
            direction: RIGHT,
            width: 400,
            height: 10,
            progress() {return player.meta.exp.div(player.meta.levelCost)},
        },
    },
    update(diff) {
        player.meta.towerCost = n(10).pow(player.meta.tower.add(1)).mul(15).pow(1.3786).floor()

        let base = n(100).add(player.meta.level.sub(100).max(0)).add(player.meta.levelTotal.sub(200).mul(50).max(0))
        player.meta.levelCost = base.min(1000).add(base.sub(1000).max(0).root(2))
        if(player.meta.levelTotal.gte(950)){player.meta.levelCost = base}
        if(player.meta.levelTotal.gte(975)){player.meta.levelCost = base.pow(1.3)}

        if(player.meta.level.gte(player.meta.towerCost)){
            player.meta.level = player.meta.level.sub(player.meta.towerCost)
            player.meta.tower = player.meta.tower.add(1)
            player.meta.towerTotal = player.meta.towerTotal.add(1)
        }
        if(player.meta.exp.gte(player.meta.levelCost)){
            player.meta.exp = player.meta.exp.sub(player.meta.levelCost)
            player.meta.level = player.meta.level.add(1)
            player.meta.levelTotal = player.meta.levelTotal.add(1)
        }

        if(player.meta.tower.gte(1)){
            player.meta.mirrorGain = n(10).pow(player.meta.tower.mul(2))
        }else{
            player.meta.mirrorGain = n(0)
        }
        player.meta.mirror = player.meta.mirror.add(player.meta.mirrorGain.mul(diff))

        if(player.meta.buyables[41].gte(1000)){
            for(let col = 1;col<=4;col++){
                let a = 10+col
                if(tmp.meta.buyables[a].canAfford){
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if(player.meta.buyables[41].gte(2000)){
            for(let col = 1;col<=3;col++){
                let a = 20+col
                if(tmp.meta.buyables[a].canAfford){
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if(player.meta.buyables[41].gte(3000)){
            for(let col = 1;col<=2;col++){
                let a = 30+col
                if(tmp.meta.buyables[a].canAfford){
                    layers.meta.buyables[a].buy()
                }
            }
        }
        if(player.meta.buyables[41].gte(5000)){
            for(let col = 1;col<=1;col++){
                let a = 40+col
                if(tmp.meta.buyables[a].canAfford){
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
                return '基础构建'+(player.meta.levelTotal.gte(1) ? 'I<br>' : '<br>');
            },
            display(){
                return '下一个: '+format(this.cost())+' n<sub>s</n><br>(+'+format(n(this.gain()))+'%)'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(10)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n(30000).pow(n(1).add(x.mul(0.008))).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.superValue.gte(this.cost())},
			style() {return {'width': "170px", "min-width": "100px", 'height': "170px",}},
            unlocks(){return n(0)},
        },
        12: {
            title() {
                return '基础构建II<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' a<br>(+'+format(n(this.gain()))+'%)'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(20).add(x.pow(5).root(2)).root(2).min(n(25).add(x.max(1).pow(5).root(2).max(1).log(10).max(1))).mul(0.5)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                let pow = n(1)
                let pow2 = n(1)
                let pow3 = n(1)
                let pow4 = n(1)
                if(n('1e1000').pow(n(1).add(x.pow(2)).root(8)).gte('1e2500')){pow = n(n(x).mul(0.003).add(1))}
                if(n('1e1000').pow(n(1).add(x.pow(2)).root(8)).pow(pow).gte('1e25000')){pow2 = n(n(x).mul(0.00009).add(1))}
                if(n('1e1000').pow(n(1).add(x.pow(2)).root(8)).pow(pow).pow(pow2).gte('1e30000')){pow3 = n(1.1)}
                if(n('1e1000').pow(n(1).add(x.pow(2)).root(8)).pow(pow).pow(pow2).pow(pow3).gte('1e70000')){pow4 = n(x.pow(0.1))}
                return n('1e1000').pow(n(1).add(x.pow(2)).root(8)).pow(pow).pow(pow2).pow(pow3).pow(pow4).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.a.value.gte(this.cost())},
			style() {return {'width': "170px", "min-width": "100px", 'height': "170px",}},
            unlocks(){return n(1)},
            unlocked(){return player.meta.levelTotal.gte(1)},
        },
        13: {
            title() {
                return '基础构建III<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' α<br>(+'+format(n(this.gain()))+'%)'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(0.01).add(x.pow(1.075).mul(0.01)).min(25)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                let base = n(x).mul(x).root(1.5).add(1)
                return base.mul(base.sub(22222).max(0).div(100).max(1)).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.a2.points.gte(this.cost())},
			style() {return {'width': "170px", "min-width": "100px", 'height': "170px",}},
            unlocks(){return n(2)},
            unlocked(){return player.meta.levelTotal.gte(2)},
        },
        14: {
            title() {
                return '基础构建IV<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' power<br>(+'+format(n(this.gain()))+'%)'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(2.5).add(x.max(1).log(2).max(1))
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                let pow = n(5)
                if(n(x).add(1).pow(5).gte(1e12)){pow = n(5).add(x.max(1).log(10).max(1).div(15))}
                if(n(x).add(1).pow(pow).gte(5e17)){pow = n(5).add(x.max(1).log(8).max(1).div(15))}
                if(n(x).add(1).pow(pow).gte(3e18)){pow = n(5).add(x.max(1).log(6).max(1).div(15))}
                if(n(x).add(1).pow(pow).gte(8e18)){pow = n(5).add(x.max(1).log(3).max(1).div(15))}
                if(n(x).add(1).pow(pow).gte(7e19)){pow = n(5).add(x.max(1).log(1.5).max(1).div(15))}
                return n(x).add(1).pow(pow).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.b.powerValue.gte(this.cost())},
			style() {return {'width': "170px", "min-width": "100px", 'height': "170px",}},
            unlocks(){return n(22)},
            unlocked(){return player.meta.levelTotal.gte(22)},
        },
        21: {
            title() {
                return '进阶构建I<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' 基础构建数量<br>(+'+format(n(this.gain()))+'%)<br><br>(基础构建数量: '+formatWhole(this.count())+')<br><br>构建效果:<br> '+this.effect()
            },
            count(){
                return n(player[this.layer].buyables[11]).add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14])
            },
            effect(){
                if(player[this.layer].buyables[this.id].gte(15)){
                    return '自动执行轮盘'
                }
                return '当前构建无效果,将在 '+formatWhole(n(15).sub(player[this.layer].buyables[this.id]))+' 进阶构建I后产生'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(5)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n(x).mul(2).add(1).pow(2).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return n(this.count()).gte(this.cost())},
			style() {return {'width': "226px", "min-width": "100px", 'height': "226px",}},
            unlocks(){return n(52)},
            unlocked(){return player.meta.levelTotal.gte(52)},
        },
        22: {
            title() {
                return '进阶构建II<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' J<br>(+'+format(n(this.gain()))+'%)<br><br>构建效果:<br> '+this.effect()
            },
            effect(){
                if(player[this.layer].buyables[this.id].gte(6)){
                    return '轮盘执行时可以同时获得电池与非电池的数值'
                }
                return '当前构建无效果,将在 '+formatWhole(n(6).sub(player[this.layer].buyables[this.id]))+' 进阶构建II后产生'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(x).mul(5).max(1).log(2).max(1).mul(10)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n('1e500000').pow(x.add(1).pow(2).max(1).log(4).max(1)).pow(n(1.5).add(x.div(100))).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.co.points.gte(this.cost())},
			style() {return {'width': "226px", "min-width": "100px", 'height': "226px",}},
            unlocks(){return n(228)},
            unlocked(){return player.meta.levelTotal.gte(228)},
        },
        23: {
            title() {
                return '进阶构建III<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' b<br>(+'+format(n(this.gain()))+'%)<br><br>构建效果:<br> '+this.effect()
            },
            effect(){
                if(player[this.layer].buyables[this.id].gte(55)){
                    return '自动购买B能量且无消耗'
                }
                return '当前构建无效果,将在 '+formatWhole(n(55).sub(player[this.layer].buyables[this.id]))+' 进阶构建II后产生'
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(x).add(4).pow(2).min(6000)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n(x).add(4).root(2).factorial().pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return player.b.value.gte(this.cost())},
			style() {return {'width': "226px", "min-width": "100px", 'height': "226px",}},
            unlocks(){return n(250)},
            unlocked(){return player.meta.levelTotal.gte(250)},
        },
        31: {
            title() {
                return '至高构建I<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' 基础构建I<sup>进阶构建I</sup> 数量<br>(+'+format(n(this.gain()))+'%)<br><br>(基础构建I<sup>进阶构建I</sup> 数量: '+formatWhole(this.count())+')<br><br>构建效果:<br> '+this.effect()
            },
            count(){
                return player.meta.buyables[11].pow(player.meta.buyables[21])
            },
            effect(){
                if(player[this.layer].buyables[this.id].gte(600)){
                    return '根据 基础构建I<sup>进阶构建I</sup> 数量 提升n<sub>s</sub>乘数<br><br>mul<sub>s</sub>(计数) = lg( 计数 + 10 )<br>mul<sub>s</sub>('+format(this.count())+') = '+format(n(this.count()).add(10).log(10))
                }
                return '当前构建无效果,将在 '+formatWhole(n(600).sub(player[this.layer].buyables[this.id]))+' 至高构建I后产生'
            },
            effectCount(){
                return n(this.count()).add(10).log(10)
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(x).add(1).pow(9).max(1).log(2).max(1)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                if(n(x).add(1).pow(27).gte(1e80)){
                    x = x.mul(1.5)
                }
                if(n(x).add(1).pow(27).gte(1e100)){
                    x = x.mul(1.5)
                }
                if(n(x).add(1).pow(27).gte(1e108)){
                    x = x.mul(1.5)
                }
                return n(x).add(1).pow(27).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return n(this.count()).gte(this.cost())},
			style() {return {'width': "338px", "min-width": "100px", 'height': "338px",}},
            unlocks(){return n(330)},
            unlocked(){return player.meta.levelTotal.gte(330)},
        },
        32: {
            title() {
                return '至高构建II<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' 进阶构建数量<br>(+'+format(n(this.gain()))+'%)<br><br>(进阶构建数量数量: '+formatWhole(this.count())+')<br><br>构建效果:<br> '+this.effect()
            },
            count(){
                return n(player[this.layer].buyables[21]).add(player[this.layer].buyables[22]).add(player[this.layer].buyables[23])
            },
            effect(){
                if(player[this.layer].buyables[this.id].gte(10)){
                    return '每个至高构建II降低b获取指数增长<br><br>(-'+format(player[this.layer].buyables[this.id].mul(0.001))+')'
                }
                return '当前构建无效果,将在 '+formatWhole(n(10).sub(player[this.layer].buyables[this.id]))+' 至高构建II后产生'
            },
            effectCount(){
                return n(this.count()).add(10).log(10)
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(4).add(x)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n(2).pow(x.add(1)).root(1.25).pow(tmp.meta.buyables[41].effectCount[0])
            },
            canAfford(){return n(this.count()).gte(this.cost())},
			style() {return {'width': "338px", "min-width": "100px", 'height': "338px",}},
            unlocks(){return n(707)},
            unlocked(){return player.meta.levelTotal.gte(707)},
        },
        41: {
            title() {
                return '最终构建I<br>';
            },
            display(){
                return '下一个: '+format(this.cost())+' 构建能量<br>(+'+format(n(this.gain()))+'%)<br><br>(构建能量(基于先前所有构建): '+formatWhole(this.count())+')<br><br>构建效果:<br><br> '+this.effect()
            },
            count(){
                return n(n(player[this.layer].buyables[11])).add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).mul(player[this.layer].buyables[21]).mul(player[this.layer].buyables[22]).mul(player[this.layer].buyables[23]).pow(player[this.layer].buyables[31]).pow(player[this.layer].buyables[32])
            },
            effect(){
                let c = [150,500,1000,2000,3000,5000,7500,375000,500000]
                let a = ''
                if(player[this.layer].buyables[this.id].gte(c[0])){
                    a += '1.CoP会根据自身提升CoP指数<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[0]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[1])){
                    a += '2.根据最终构建I的数量指数降低先前所有构建需求<br>(^'+format(this.effectCount()[0],5)+')<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[1]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[2])){
                    a += '3.自动购买基础构建<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[2]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[3])){
                    a += '4.自动购买进阶构建<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[3]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[4])){
                    a += '5.自动购买至高构建<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[4]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[5])){
                    a += '6.自动购买最终构建<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[5]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[6])){
                    a += '7.解锁 元破碎 页面<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[6]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[7])){
                    a += '8.解锁 元监视 页面<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[7]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                if(player[this.layer].buyables[this.id].gte(c[8])){
                    a += '9.占位符<br><br>'
                }else{
                    return a+'下一个效果将在 '+formatWhole(n(c[8]).sub(player[this.layer].buyables[this.id]))+' 最终构建I'
                }
                return a
            },
            effectCount(){
                return [n(1).div(player[this.layer].buyables[this.id].root(2).sub(25).mul(0.28).max(1))]
            },
            gain(x=player[this.layer].buyables[this.id]){
                return n(1)
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1)
                player.meta.exp = player.meta.exp.add(this.gain())
            },
            cost(x){
                return n(10).pow(x.add(10)).pow(x.add(10))
            },
            canAfford(){return n(this.count()).gte(this.cost())},
			style() {return {'width': "672px", "min-width": "100px", 'height': "672px",}},
            unlocks(){return n(876)},
            unlocked(){return player.meta.levelTotal.gte(876)},
        },
    },/*
	challenges: {
		11: {
			name: "破碎集合",
			challengeDescription(){
			  return '进入破碎集合后你将以下效果开始挑战<br><br>重置:重置主树,元破碎,保留侧边层,压缩点数,集合公式<br><br>变化:所有非自动化荣耀无效,以50倍t增长开始挑战<br><br>扩展:<br>在每层你需要选择2次公式并将其无效<br>在完成目标后你可以进入下层或继续完成目标<br>根据目标完成次数你可以选择解锁并增加对应集合公式的潜力值<br>进入下层/退出挑战时你将保留最后选择的集合公式<br><br>目标: '+formatWhole(0)+' / '+formatWhole(this.nextLayer())+'<br><br>效果:<br><br><br><-目标里程-><br>'+(inChallenge('meta',11) ? '' : '需先进入破碎集合')
			},
			unlocked(){return player.meta.tower.gte(1)},
			nextLayer(){return n(5)},
			canComplete: function() {return false},
            style(){return 'border-radius:5px;width: 580px;height: 650px;background: #fff;color: rgb(54, 54, 54)'},
		},
	},*/
    clickables:brokenSet,//靠你了 我不清楚你怎么想的 你应该是想要for循环处理这个东西吧
	microtabs:{
        "主要":{
			"回切任务":{
				content:[
                    ["blank", "25px"],
                    ["display-text", function() {return '<span style="color:#aaa">————长按以构建————</span>'}],
                    ["blank", "25px"],
					['row',[["buyable", 11],["buyable", 12],["buyable", 13],["buyable", 14]]],
					['row',[["buyable", 21],["buyable", 22],["buyable", 23]]],
					['row',[["buyable", 31],["buyable", 32]]],
					['row',[["buyable", 41]]],
                    ["blank", "100px"],
                    ["display-text", function() {return '回切进度'}],
                    ["display-text", function() {return '('+format(player.meta.exp)+'%)'+(player.meta.levelCost.gt(100) ? ' -> ('+format(player.meta.levelCost)+'%)' : '')}],
                    ["bar", "echeprogress2"],
                    ["display-text", function() {
                        let a = n(1)
                        let c = [11,12,13,14,21,22,23,31,32,41]
                        for(let i = 0;i<=999;i++){
                            if(c[i]!==undefined){
                                if(player.meta.levelTotal.gte(tmp.meta.buyables[c[i]].unlocks)){
                                    if(c[i+1]==undefined){
                                        return '<br><span id="points" style="color:#aaa">没有更多任务了</span><br>下一回切指数塔: <h2 id="points">'+format(player.meta.level,0)+'</h2> / <h2 id="points" style="color:#aaa">'+format(player.meta.towerCost,0)+'</h2>'
                                    }else{
                                        a = tmp.meta.buyables[c[i+1]].unlocks
                                    }
                                }else{
                                    break
                                }
                            }else{
                                return '<br><span id="points" style="color:#aaa">没有更多任务了</span>'
                            }
                        }
                        return '<br>下一回切任务: <h2 id="points">'+format(player.meta.level,0)+'</h2> / <h2 id="points" style="color:#aaa">'+format(a,0)+'</h2>'
                    }],
                    ["blank", "100px"],
				]
			},
			"元破碎":{
                unlocked(){return player.meta.buyables[41].gte(7500)},
				content:[
                    ["blank", "7px"],
                    ["display-text", function() {return player.meta.towerTotal.gte(1) ? '' : '你需要获得回切指数塔以推进下一步内容'}],
                    ["blank", "5px"],
                    ["microtabs", "破碎"],
				]
			},
			"元监视":{
                unlocked(){return player.meta.buyables[41].gte(375000)},
                buttonStyle(){return{'border-color': '#aaa'}},
				content:[
                    ["blank", "7px"],
                    ["display-text", function() {return '<h3>Scores(湮灭能量) = 湮灭能量<h3>'}],
                    ["display-text", function() {return 'Scores('+format(player.meta.scores)+') = '+format(player.meta.scores)}],
                    ["blank", "5px"],
                    ["microtabs", "监视器"],
				]
			},
		},
        "监视器":{
			"集合世界":{
                buttonStyle(){return{'border-color': '#aaa'}},
				content:[
                    ["display-text", function(){
                        let res = ['Avolve','阿尔法能量','RA','timewall','γ','gamma','B能量','RC']
                        let resEff = [['add',player.a.valueA],['add',player.a2.points],['add',player.ro.valueA],['mul',tmp.a2.timespeedBoost],['mul',player.a2.gamma],['mul',player.a2.valueGamma],['mul',player.b.points],['pow',player.ro.valueC]]

                        let effNumber = n(0)
                        
                        let first = '<table border="2" style="border-collapse: collapse; padding:7px; border-color:#fff;"><tr><td style="padding:7px; width:200px">物质</td><td style="padding:5px; width:200px">效果</td><td style="padding:7px; width:200px">崩坠能量</td></tr>'
                        for(i in res){
                            let com = '+'
                            let number = resEff[i][1]
                            if(resEff[i][0]=='add'){
                                com = '+'
                                effNumber = effNumber.add(number)
                            }else if(resEff[i][0]=='mul'){
                                com = '×'
                                effNumber = effNumber.mul(n(number).max(1))
                            }else if(resEff[i][0]=='pow'){
                                com = '^'
                                effNumber = effNumber.pow(n(number).max(1))
                            }

                            let a = '<tr><td style="padding:7px; width:200px">'+res[i]+'</td><td style="padding:7px; width:200px">'+com+format(number)+'</td><td style="padding:7px; width:200px">'+format(effNumber)+'</td></tr>'
                            first += a
                        }

                        player.meta.scores = n(effNumber)

                        let fin = first+'</table>'
                        return fin
                    }],
                    ["blank", "100px"],
				]
			},
        },
        "破碎":{
            "破碎集合":{
                buttonStyle(){return{'border-color': '#aaa'}},
                unlocked(){return player.meta.tower.gte(1)},
                content:[
                    'challenges',
                    ["blank", "100px"],
                ]
            },
            "集合公式":{
                buttonStyle(){return{'border-color': '#aaa'}},
                unlocked(){return player.meta.tower.gte(1)},
                content(){
                    let formats = []
                    for(i in player.meta.brokenSetUnlockOrder) formats.push(["clickable",player.meta.brokenSetUnlockOrder[i]])
                    return formats
                }
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
        ["display-text", function() { return getPointsDisplay() }],
        ["blank", "25px"],
        ["blank", "25px"],
        ["display-text", function() {return '回切进度'}],
        ["display-text", function() {return '('+format(player.meta.exp)+'%)'+(player.meta.levelCost.gt(100) ? ' -> ('+format(player.meta.levelCost)+'%)' : '')}],
        ["bar", "echeprogress"],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '你已经到达了 <h2 id="points">'+format(player.meta.level,0)+'</h2> 回切阶层'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '<i style="color:#aaa"> 你需要 <h2 id="points" style="color:#aaa">'+format(player.meta.towerCost,0)+'</h2> 回切阶层晋升回切指数塔 </i>'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '你已经到达了 <h2 id="points">'+format(player.meta.tower,0)+'</h2> 回切指数塔'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '<i style="color:#aaa">你的回切指数塔为你生产 <h2 id="points" style="color:#aaa">'+format(player.meta.mirrorGain,0)+'</h2> 凌片每秒</i>'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '你拥有 <h2 id="points">'+format(player.meta.mirror,0)+'</h2> 凌片'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '<i style="color:#aaa">ShArD(凌片) = '+tmp[this.layer].displayFormula[0]+'</i>'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '<big>ShArD('+format(player.meta.mirror,0)+') = '+tmp[this.layer].displayFormula[0]+'</big>'}],
        ["display-text", function() {return '↓ ↓ ↓'}],
        ["display-text", function() {return '<i style="color:#aaa">目前ShArD未在任何公式中出现</i>'}],
        ["blank", "25px"],
        ["blank", "25px"],
        ["microtabs", "主要"],
    ],
    layerShown() { return tmp.goals.unlocks>=8},
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