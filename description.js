
<p id='dfs-description'> 
  Depth-First traversal will continually travel deeper into a tree before 
  switching branches. By given a node, we must visit all of 
  it's descendants before visiting it's sibling.
  The strategy is to use an array as a stack, and use push to add to the top of
  the stack and pop to remove the top.
</p>

<p id='bfs-description'>
  Breadth-First traversal will visit all nodes across a level, 
  before moving to the next level, which means we travel as much as 
  we can before going deeper into the tree. The strategy is to use as array as queue,
  and use shift to remove the front of the queue and push will add to the back of the queue. 
</p>

<p id='double-bfs-description'>
  Double Breadth-First Search combine forward search which start vertex toward 
  goal vertex and backward search form goal vertex toward start vertex. 
  The strategy is to find the middle point between start and end, and to create two
  queues and the search terminates when find the same node in both queues. 
  two graphs intersect.
</p>

<p id='random-description'>
  A type of local random search, where every iteration is choosing a random node
  to travel. To create an array as a stack, and a random node on every iteration 
  to the top of the stack and pop to remove the top.
</p>
