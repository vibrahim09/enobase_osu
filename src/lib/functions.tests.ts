import {
    CeilRequestBody,
    dispatch,
    DivideRequestBody, FloorRequestBody, MaxRequestBody,
    MeanRequestBody,
    MedianRequestBody,
    MinRequestBody,
    MultiplyRequestBody, PowRequestBody, RoundRequestBody
} from './functions'
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
    it('should return the average of three numbers', () => {
        const reqBody: MeanRequestBody = { function: 'mean', numbers: [1, 2, 3] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 2 })
    })
    it('should return the smallest number in a list', () => {
        const reqBody: MinRequestBody = { function: 'min', numbers: [11, 2, 3] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 2 })
    })
    it('should return the largest number in a list', () => {
        const reqBody: MaxRequestBody = { function: 'max', numbers: [11, 22, 33] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 33 })
    })
    it('should return the nearest whole integer, rounded down, when no precision is provided', () => {
        const reqBody: RoundRequestBody = { function: 'round', number: 11.3 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 11 })
    })
    it('should return the nearest whole integer, rounded up, when no precision is provided', () => {
        const reqBody: RoundRequestBody = { function: 'round', number: 11.6 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 12 })
    })
    it('should return the nearest float to the two-digit precision level', () => {
        const reqBody: RoundRequestBody = { function: 'round', number: 11.768, precision: 2 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 11.77 })
    })
    it('should return the nearest float to the one-digit precision level', () => {
        const reqBody: RoundRequestBody = { function: 'round', number: 11.768, precision: 1 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 11.8 })
    })
    it('should return the nearest integer value less than or equal to the given number', () => {
        const reqBody: FloorRequestBody = { function: 'floor', number: 11.768 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 11 })
    })
    it('should return the nearest integer value greater than or equal to the given number', () => {
        const reqBody: CeilRequestBody = { function: 'ceil', number: 11.768 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 12 })
    })
    it('should return the exponentiation result of a given number raised to the given power', () => {
        const reqBody: PowRequestBody = { function: 'pow', base: 2, exponent: 3 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 8 })
    })
    it('should return the square of a given number when no exponent is provided', () => {
        const reqBody: PowRequestBody = { function: 'pow', base: 4 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: 16 })
    })
    it('should return the list of items', () => {
        const reqBody: ListRequestBody<number> = { function: 'list', items: [1, 2, 3] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: [1, 2, 3] })
    })
    it('should return the item at the given index', () => {
        const reqBody: AtRequestBody<string> = { function: 'at', items: ["hello", "kk", "mix"], index: 1 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: "kk" })

    })
    it ('should return the first item in the list', () => {
        const reqBody: FirstRequestBody<string> = { function: 'first', items: ["hello", "kk", "mix"], index: 0 }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: "hello" })
    })
    it ('should return the last item in the list', () => {
        const reqBody: LastRequestBody<string> = { function: 'last', items: ["hello", "kk", "mix"] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: "mix" })
    })
    it ('should return the sorted list', () => {
        const reqBody: SortRequestBody<number> = { function: 'sort', items: [1,4,5,7,99,3,2,11] }
        const result = dispatch(reqBody)
        expect(result).toEqual({ result: [99,11,7,5,4,3,2,1] })
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
