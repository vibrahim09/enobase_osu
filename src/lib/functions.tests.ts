import {dispatch, DivideRequestBody, MedianRequestBody, MultiplyRequestBody} from './functions'
import {AddRequestBody, SubtractRequestBody, ListRequestBody, AtRequestBody, FirstRequestBody, 
    LastRequestBody,SortRequestBody, ReverseRequestBody,ConcatRequestBody,SomeRequestBody, FunctionRequestBody} from './functions'
describe('dispatch function', () => {
    it('should return the sum of two numbers', () => {
      const reqBody: AddRequestBody = { function: 'add', num1: 1, num2: 2 }
      const result = dispatch(reqBody)
      expect(result).toEqual({ result: 3 })
    })
    it('should return the difference of two numbers', () => {
      const reqBody: SubtractRequestBody = { function: 'subtract', num1: 5, num2: 2 }
      const result = dispatch(reqBody)
      expect(result).toEqual({ result: 3 })
    })
    it('should return the product of two numbers', () => {
        const reqBody: MultiplyRequestBody = { function: 'multiply', num1: 5, num2: 2 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 10 })
    })
    it('should return the quotient of two numbers', () => {
        const reqBody: DivideRequestBody = { function: 'divide', num1: 10, num2: 2 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 5 })
    })
    it('should return an error when dividing by 0', () => {
        const reqBody: DivideRequestBody = { function: 'divide', num1: 10, num2: 0 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ error: "Division by zero is not allowed" })
    })
    it('should return the middle number of an odd number of items', () => {
        const reqBody: MedianRequestBody = { function: 'median', numbers: [1, 2, 3, 4, 5] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 3 })
    })
    it('should return the average of the middle two numbers of an even number of items', () => {
        const reqBody: MedianRequestBody = { function: 'median', numbers: [2, 4, 6, 8] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 5 })
    })
    it('should return the list of items', () => {
      const reqBody: ListRequestBody<number> = { function: 'list', items: [1, 2, 3] }
      const result = dispatch(reqBody)
      expect(result).toEqual({ result: [1, 2, 3] })
    })
    it('should return the item at the given index', () => {
      const reqBody: AtRequestBody<string> = { function: 'at', items: ["hello", "kk", "mix"], index: 1 }
      const result = dispatch(reqBody)
      expect(result).toBe("kk")

    })
    it ('should return the first item in the list', () => {
        const reqBody: FirstRequestBody<string> = { function: 'first', items: ["hello", "kk", "mix"], index: 0 }
        const result = dispatch(reqBody)
        expect(result).toBe("hello")
        })
    it ('should return the last item in the list', () => {
        const reqBody: LastRequestBody<string> = { function: 'last', items: ["hello", "kk", "mix"] }
        const result = dispatch(reqBody)
        expect(result).toBe("mix")
        })
    it ('should return the sorted list', () => {
        const reqBody: SortRequestBody<number> = { function: 'sort', items: [1,4,5,7,99,3,2,11] }
        const result = dispatch(reqBody)
        expect(result).toEqual([99,11,7,5,4,3,2,1])
        })
    it ('should return the reversed list', () => {
        const reqBody: ReverseRequestBody<number> = { function: 'reverse', items: [1,4,5,7,99,3,2,11] }
        const result = dispatch(reqBody)
        expect(result).toEqual([11,2,3,99,7,5,4,1])
        })
    it ('should concat the list of items', () => {
        const reqBody: ConcatRequestBody<number> = { function: 'concat', lists: [[1,2,3],[4,5,6],[7,8,9]] }
        const result = dispatch(reqBody)
        expect(result).toEqual([1,2,3,4,5,6,7,8,9])
        })
    it('should return false if no items match the predicate', () => {
        const reqBody: SomeRequestBody<number> = { function: 'some', items: [1, 2, 3, 4, 5], predicate: (item) => item > 5 };
        const result = dispatch(reqBody);
        expect(result).toBe(false)
        });
    
        
    it('should return undefined for invalid request', () => {
      const reqBody: FunctionRequestBody = { function: 'invalid' }
      const result = dispatch(reqBody)
      expect(result).toBeUndefined()
    })
   

});