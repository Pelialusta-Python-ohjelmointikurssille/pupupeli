describe('taskIdentifier', () => {
  const constantURL = 'http://localhost:8000/?task=2';

  const getTaskIdentifierFromURL = (url) => {
    const regex = /[?&]task=([^&]*)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const taskId = parseInt(match[1], 10);
      return isNaN(taskId) ? 1 : taskId;
    }
    return 1;
  };

  beforeEach(() => {
    jest.resetModules(); 
  });

  it('should return the task identifier from the URL when task parameter is present', async () => {
    const taskIdentifier = getTaskIdentifierFromURL(constantURL);
    expect(taskIdentifier).toBe(2);
  });

  it('should return 1 if no task identifier is present in the URL', async () => {
    const taskIdentifier = getTaskIdentifierFromURL('http://localhost:8000/');
    expect(taskIdentifier).toBe(1);
  });

  it('should return 1 if the task parameter is empty', async () => {
    const taskIdentifier = getTaskIdentifierFromURL('http://localhost:8000/?task=');
    expect(taskIdentifier).toBe(1);
  });

  it('should return 1 if the task parameter is NaN', async () => {
    const taskIdentifier = getTaskIdentifierFromURL('http://localhost:8000/?task=abc');
    expect(taskIdentifier).toBe(1);
  });

  it('should return 1 if there are multiple tasks', async () => {
    const taskIdentifier = getTaskIdentifierFromURL('http://localhost:8000/?task=1?task=2');
    expect(taskIdentifier).toBe(1);
  });

});


