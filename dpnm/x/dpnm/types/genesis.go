package types

import "fmt"

// DefaultIndex is the default capability global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default Capability genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		// this line is used by starport scaffolding # genesis/types/default
		CbdcList: []*Cbdc{},
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	// this line is used by starport scaffolding # genesis/types/validate
	// Check for duplicated ID in cbdc
	cbdcIdMap := make(map[string]bool)

	for _, elem := range gs.CbdcList {
		if _, ok := cbdcIdMap[elem.Id]; ok {
			return fmt.Errorf("duplicated id for cbdc")
		}
		cbdcIdMap[elem.Id] = true
	}

	return nil
}
