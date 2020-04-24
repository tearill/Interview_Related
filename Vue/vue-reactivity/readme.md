1. {{ observerData.name }} 取值 触发一次 `get`  
2. 已经实现通过 Proxy 代理了 get 这个行为，所有能知道 get 这个行为发生  
  1. 进行依赖收集  
  2. 收集完成的依赖  
    ```js
    {
      data: { name: [], sex: [], age: [] },
      data1: {},
      data2: {}
    }
    ```
  3. 后续用户触发了 observerData.name = 'newName'  
    1. 已经事先通过 Proxy 代理了 set 行为  
    2. 能拿到 target、key  
    3. key 发生变化了，哪些地方需要更新 => dep[target][key], 重新执行  