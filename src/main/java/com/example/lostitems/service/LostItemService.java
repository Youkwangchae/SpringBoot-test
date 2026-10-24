package com.example.lostitems.service;

import com.example.lostitems.domain.ItemStatus;
import com.example.lostitems.domain.LostItem;
import com.example.lostitems.dto.CreateItemRequest;
import com.example.lostitems.dto.ItemResponse;
import com.example.lostitems.repository.LostItemRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class LostItemService {

	private final LostItemRepository repository;

	public LostItemService(LostItemRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public ItemResponse register(CreateItemRequest request) {
		LostItem item = new LostItem(
				request.name(), request.building(), request.foundDate(), request.storage());
		return ItemResponse.from(repository.save(item));
	}

	public List<ItemResponse> findAll(String building) {
		List<LostItem> items = (building == null || building.isBlank())
				? repository.findAll()
				: repository.findByBuilding(building);
		return items.stream().map(ItemResponse::from).toList();
	}

	public ItemResponse findById(Long id) {
		return ItemResponse.from(findOrThrow(id));
	}

	@Transactional
	public ItemResponse returnItem(Long id) {
		LostItem item = findOrThrow(id);
		if (item.getStatus() == ItemStatus.RETURNED) {
			throw new ItemAlreadyReturnedException(id);
		}
		item.markReturned();
		return ItemResponse.from(item);
	}

	private LostItem findOrThrow(Long id) {
		return repository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
	}
}
