/*****************Класс - бинарное дерево**********************/
function BinaryTree() {
	this.root = null;
	this.coordinates=new Array();
}
BinaryTree.prototype = {
	constructor: BinaryTree,
	/**********добавление элемента**********/
	add: function (value){
		var node = { 
			value: value, 
			left: null,
			right: null 
        };
		var current=this.root;
		if (this.root === null){
            this.root = node;
		}
		else {
			while(true) {
				if (value<current.value) {
					if (current.left===null) {
						current.left=node;
						break;
					}
					else current=current.left;
				}
				else if (value>current.value) {
					if (current.right===null) {
						current.right=node;
						break;
					}
					else current=current.right;
				}
				else break;
			}
		}
	},
	/*************Обход Дерева**********/
	 traverse: function(process){
        
		//вспомогательная функция
        function inOrder(node){
            if (node){
                
                //обход левого поддерева
                if (node.left !== null){
                    inOrder(node.left);
                }            
                
                //вызов функции обработки узла
                process.call(this, node);
				
                //traverse the right subtree
                if (node.right !== null){
                    inOrder(node.right);
                }
            }        
        }
        
        inOrder(this.root); 
    },
	/****************Функция расчёта координат************/
	Update: function(x_distance,y_distance,x,y) {
		var tree=this;
		var c_x=x;
		function children_count(node) {
			var count_ch = 0;
			if (node != null) {
				count_ch += 1;
				count_ch += children_count(node.left);
				count_ch += children_count(node.right);
			}
			return count_ch;
		}	
		
		/****вспомогательная функция******************/
		function UpdateNode(root, x, y, block) {
			if (root == null)
				return;			
			block.call(this, root.value,x, y, x, y);
			var count_r=0;
			var count_l=0;
			
			if (root.left)
				count_l=children_count(root.left.right);
			if (root.right)
				count_r=children_count(root.right.left);
			var max_count=Math.max(count_r,count_l)+1;
			if (root.left != null)
				update_left(root.left, x, y, max_count,block);
			if (root.right != null)
				update_right(root.right, x, y,max_count, block);			
		}
		/****вспомогательная функция (левое поддерево)*************/
		function update_left(node, parent_x, parent_y,count, block) {
			var count_r=0;
			var count_l=0;
			if (node.left)
				count_l=children_count(node.left.right);
			if (node.right)
				count_r=children_count(node.right.left);
			var max_count=Math.max(count_r,count_l);
			var x = parent_x - x_distance - (count*x_distance);
			var y = parent_y + y_distance;
			block.call(this, node.value, x, y, parent_x, parent_y);
			
			if (node.left != null)
				update_left(node.left, x, y,max_count, block);
			if (node.right != null)
				update_right(node.right, x, y,max_count, block);
		}
		/****вспомогательная функция (правое поддерево)*************/
		function update_right(node, parent_x, parent_y,count, block) {
			var count_r=0;
			var count_l=0;
			if (node.left)
				count_l=children_count(node.left.right);
			if (node.right)
				count_r=children_count(node.right.left);
			var max_count=Math.max(count_r,count_l);
			//alert(count_r+" "+count_l);
			/*count=1;
			if (parent_x==c_x)
				count=2;*/
			
			var x = parent_x + x_distance + (count*x_distance);
			var y = parent_y + y_distance;
			block.call(this, node.value,x,y, parent_x, parent_y);
			if (node.left != null)
				update_left(node.left, x, y,max_count, block); 
			if (node.right != null)
				update_right(node.right, x, y,max_count, block); 
		}
		/*********вспомогательная функция сохранения координат************/
		function setCoordinates(value,x,y,parent_x,parent_y) {
			tree.coordinates[value]={
				value: value,
				parent_x: parent_x,
				parent_y: parent_y,
				x: x,
				y:y
			};
			//alert(this.);
		}
		
		 
		UpdateNode(this.root,x,y, setCoordinates);
	}
};

/******************Класс - создаёт анимированное дерево********************/
//Конструктор
function AnimatedBinaryTree(canvasSelector, radiusNodes) {
	this.tree = new BinaryTree();
	this.$canvas=$(canvasSelector);
	this.radiusNodes=radiusNodes;
	this.isBuild=false;
	this.isDraw=false;
	this.isTraverse=false;
	var self=this;
	Clear();
	
	//анимированное заполнение массива
	function FillArray(nodes) {
		var i=0;
		var delay=3000;
		nodes.forEach(function(item) {
			var x=37+i*(2*self.radiusNodes+10);
			self.$canvas.drawArc({
					  groups: ['node'+item],
					  strokeWidth: 2,
					  layer: true,
					  x: x, 
					  y: 50,
					  radius: self.radiusNodes,
					  fillStyle: 'orange',
					  strokeStyle: 'orange',
					  opacity: 0.5,
					  visible: true,
			});
			self.$canvas.drawText({
				  groups: ['node'+item],
				  layer:true,
				  visible:true,
				  fillStyle: '#9cf',
				  strokeStyle: '#25a',
				  strokeWidth: 1,
				  x: x, 
				  y: 50,
				  fontSize: 15,
				  fontFamily: 'Verdana, sans-serif',
				  text: item
			});
			self.$canvas.delayLayerGroup('node'+item, i*1000);
			
				
  
					
			i++;
		});
	}
	//Очистка 
	function Clear() {
		self.$canvas.clearCanvas();
		
		for (i=0;i<11; i++) {
			var x=37+i*(2*self.radiusNodes+10);
			var width=2*self.radiusNodes+10;
			var height=2*self.radiusNodes+10;
			self.$canvas.drawRect({
			  strokeStyle: '#48515A',
			  layer:true,
			  strokeWidth: 5,
			  x: x, y: 50,
			  width: width,
			  viible: true,
			  height: height 
			});
		}	
	}
	
	//Отрисовка узлов и ребёр
	function Draw(nodes) {
		self.tree.Update(30,70,550,150);
		var delay=3000;
		var delay_line=4500;
		var index=0;
		nodes.forEach(function(item) {
			//delay_line=delay_line+i*100;
			var x1=self.tree.coordinates[item].parent_x;
			var x2=self.tree.coordinates[item].parent_x;
			var y1=self.tree.coordinates[item].parent_y+self.radiusNodes;
			var y2=self.tree.coordinates[item].parent_y+self.radiusNodes;
			var y3=self.tree.coordinates[item].y-self.radiusNodes;
			var x=self.tree.coordinates[item].x;
			var y=self.tree.coordinates[item].y;
			//alert(x1+" "+x2+" "+x);
			if (self.tree.coordinates[item].parent_x-self.tree.coordinates[item].x)
					$('canvas').drawLine({
					  name: 'line'+item,
					  layer: true,
					  strokeStyle: 'orange',
					  opacity: 0.5,
					  strokeWidth: 3,
					  x1: x1, 
					  y1: y1,
					  x2: x2,  
					  y2: y2,
					  visible: false
					});
			self.$canvas.delayLayerGroup('node'+item, index*delay);
			self.$canvas.delayLayer('line'+item, (index+1)*delay+index*index*100);
			self.$canvas.animateLayerGroup('node'+item, 
				{
				  x: x, 
				  y: y,
				  visible: true,
				}, 
				delay, 
				function(layer) { 
					$(this).animateLayer(layer, {		
					x: x, 
					y: y	
				}, 
				  'slow', 'ease-in-out');
				}
			);
			self.$canvas.animateLayer('line'+item,{
				x2: x,  
				y2: y3,
				visible:true},
				delay_line,
				function(layer) {
					$(this).animateLayer(layer, {		
						visible:true	
					},
					delay_line);
				}
			);
			index++;
	});
	setTimeout(function() {
			self.isDraw=true;
		},48000)
	}
	
	//Генерация случайного дерева
	this.randomGenerate = function () {
		Clear();
		var nodes=new Array(11);
		for (i=0; i<11; i++) {
			var temp=Math.floor(Math.random()*1001)%100;
			while(nodes.includes(temp))
				temp=Math.floor(Math.random()*1001)%100;
			nodes[i]=temp;
			self.tree.add(temp);
		}
		self.isBuild=true;
		FillArray(nodes);
		Draw(nodes);
	},
	//Генерация сбалансированного дерева
	this.balanceGenerate = function () {
		Clear();
		var numbers=new Array(11);
		var nodes=new Array(11);
		var indexes=new Array();
		indexes.push(5);
		indexes.push(2);
		indexes.push(8);
		indexes.push(1);
		indexes.push(9);
		indexes.push(3);
		indexes.push(7);
		indexes.push(10);
		indexes.push(0);
		indexes.push(4);
		indexes.push(6);
		for (i=0; i<11; i++) {
			var temp=Math.floor(Math.random()*1001)%100;
			while(numbers.includes(temp))
				temp=Math.floor(Math.random()*1001)%100;
			numbers[i]=temp;
		}
		numbers.sort(function (a, b) {
		  if (a < b) {
			return -1;
		  } else if(a > b) {
			return 1;
		  }
		  return 0;
		});
		for (i=0; i<11; i++) {
			var index=indexes[i];
			nodes[i]=numbers[index];
			self.tree.add(nodes[i]);
		}
		self.isBuild=true;
		FillArray(nodes);
		Draw(nodes);
	},
	//Обход дерева
	this.traverse = function () {
		
		
		index=0;
		if (!self.isBuild || !self.isDraw) {
			alert("Дерево не построено");
			return -1;
		}
		if (self.isTraverse) {
			alert("Обход дерева не завершён");
			return -1;
		}
		self.isTraverse=true;
		self.tree.traverse(stop);
		self.tree.traverse(returnNode);
		
		//Остановка анимации
		function stop(node) {
			self.$canvas.stopLayerGroup('node'+node.value);
		}
		//воззврат узла в прежнее состояние
		function returnNode(node) {
			self.$canvas.animateLayerGroup('node'+node.value,{
				fillStyle: 'orange',
				visible:true},
				1
			);
			
			self.$canvas.removeLayerGroup('node_traverse'+node.value);
		}
		
		//Отрисовка узла при проходе
		function drawNode(node) {
			var nodeCoordinates=self.tree.coordinates[node.value];
			self.$canvas.delayLayerGroup('node'+node.value, index*1850);
			self.$canvas.animateLayerGroup('node'+node.value,{
				fillStyle: 'red',
				visible:true},
				1
			);
			var x=37+index*(2*self.radiusNodes+10);
			
			self.$canvas.drawArc({
					  groups: ['node_traverse'+node.value],
					  strokeWidth: 2,
					  layer: true,
					  x: x, 
					  y: 50,
					  radius: self.radiusNodes,
					  fillStyle: 'orange',
					  strokeStyle: 'orange',
					  opacity: 0.5,
					  visible: false,
			});
			self.$canvas.drawText({
				  groups: ['node_traverse'+node.value],
				  layer:true,
				  visible:false,
				  fillStyle: '#9cf',
				  strokeStyle: '#25a',
				  strokeWidth: 1,
				  x: x, 
				  y: 50,
				  fontSize: 15,
				  fontFamily: 'Verdana, sans-serif',
				  text: node.value
			});
			self.$canvas.delayLayerGroup('node_traverse'+node.value, index*2000);
			self.$canvas.animateLayerGroup('node_traverse'+node.value,{
				visible:true},
				1
			);
			index++;
		}
		self.tree.traverse(drawNode);
		
		setTimeout(function() {
			self.isTraverse=false;
		},23000)
		
		
	}
	
};

/***********обработчики события*****************************/
$(function() {
	var animatedTree=new AnimatedBinaryTree('#myCanvas', 20);
	$("#traverse").click(function (e) {
		e.preventDefault();
		animatedTree.traverse();
		return false;
	});
	
	$("#genBalannce").click(function (e) {
		e.preventDefault();
		$('#myCanvas').removeLayers();
		$('#myCanvas').clearCanvas();
		delete animatedTree;
		animatedTree=new AnimatedBinaryTree('#myCanvas', 20);
		animatedTree.balanceGenerate();
		return false;
	});
	$("#genRandom").click(function (e) {
		e.preventDefault();
		$('#myCanvas').removeLayers();
		$('#myCanvas').clearCanvas();
		delete animatedTree;
		animatedTree=new AnimatedBinaryTree('#myCanvas', 20);
		animatedTree.randomGenerate();
		return false;
	});
	
	
});