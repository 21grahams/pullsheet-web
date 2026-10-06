import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, listSingles } from './index';

const rpc = vi.fn();
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...args: unknown[]) => rpc(...args) } }));

beforeEach(() => rpc.mockReset());

describe('api', () => {
  it('maps rows to app types, keeping missing prices as null', async () => {
    rpc.mockResolvedValue({
      error: null,
      data: [
        {
          id: 1,
          pokemon: 'Marill',
          set_name: 'Southern Islands',
          condition: 'LP',
          extra: '',
          display_name: 'Marill - Southern Islands - LP',
          quantity: 1,
          purchase_date: '2026-03-28',
          total_cost: 88.39,
          fees: 0,
          fee_units: 0,
          unit_value: 88.02,
          q1_unit_value: 70.82,
          q2_unit_value: 80.07,
          q3_unit_value: 88.02,
          q4_unit_value: null,
        },
      ],
    });
    const [single] = await listSingles();
    expect(rpc).toHaveBeenCalledWith('api_list_singles');
    expect(single).toMatchObject({ setName: 'Southern Islands', totalCost: 88.39, unitValue: 88.02 });
    expect(single!.quarterUnitValues).toEqual([70.82, 80.07, 88.02, null]);
  });

  it("throws the database's error message", async () => {
    rpc.mockResolvedValue({
      error: { message: 'permission denied for function api_list_singles' },
      data: null,
    });
    await expect(listSingles()).rejects.toThrow(ApiError);
    await expect(listSingles()).rejects.toThrow('permission denied');
  });
});
